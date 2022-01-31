import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { AddFundsDTO } from '../dto/addFunds.dto';
import Coins from '../entities/coins.entity';
import Transactions from '../entities/transactions.entity';
import Wallet from '../entities/wallet.entity';
import { CoinsService } from './coins.service';
import { TransferFundsDTO } from '../dto/transferFunds.dto';
import { transactionsSerializer } from '../utils/serializers/transactionsSerializer';
import { ITransactions } from '../interfaces/transactions.interface';
import { serializeOneWallet, serializeAllWallet } from '../utils/serializers/walletsSerializer';
import { IWallets } from '../interfaces/allWallets.interface';

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletsRepository: Repository<Wallet>,
        @InjectRepository(Coins)
        private readonly coinsRepository: Repository<Coins>,
        @InjectRepository(Transactions)
        private readonly transactionsRepository: Repository<Transactions>,
        private readonly coinsService: CoinsService
    ) {}

    async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
        const uniqueCheck = await this.walletsRepository.findOne({ cpf: createWalletDto.cpf });

        if (uniqueCheck) throw new BadRequestException(`cpf ${createWalletDto.cpf} already exists`);

        const { address, name, cpf, birthdate, createdAt, updatedAt } = await this.walletsRepository.save(
            createWalletDto
        );
        return { address, name, cpf, birthdate, createdAt, updatedAt };
    }

    async findAll(querys: any): Promise<IWallets[]> {
        const allWallets = this.walletsRepository
            .createQueryBuilder('wallets')
            .leftJoinAndSelect('wallets.coins', 'coins')
            .leftJoinAndSelect('coins.transactions', 'transactions');

        Object.keys(querys).forEach((query) => {
            const subquery = this.walletsRepository
                .createQueryBuilder('wallets')
                .select('wallets.address')
                .leftJoin('wallets.coins', 'coins')
                .leftJoin('coins.transactions', 'transactions');
            subquery.andWhere(`${query} = :${query}`);
            allWallets.setParameter(`${query}`, querys[query]);
            allWallets.andWhere(`wallets.address  in (${subquery.getQuery()})`);
            allWallets.setParameters(subquery.getParameters());
        });

        const serializedWallets = serializeAllWallet(await allWallets.getMany());
        if (serializedWallets.length === 0) throw new NotFoundException('No Wallets Found');

        return serializedWallets;
    }

    async findOne(address: string): Promise<Wallet> {
        const oneWallet = await this.walletsRepository.findOne({
            where: {
                address
            }
        });
        if (!oneWallet) throw new NotFoundException('Wallet address Not Found');

        const serializedWallet = serializeOneWallet(oneWallet);
        return serializedWallet;
    }

    async updateFunds(address: string, addFundsDTO: AddFundsDTO[]): Promise<Transactions[]> {
        await this.validateFunds(address, addFundsDTO);

        const transactions = await Promise.all(
            addFundsDTO.map(async (coins) => {
                const getCotation = await this.coinsService.findExternalData(coins);

                let findCoin = await this.coinsService.findOneCoin(address, coins.quoteTo);

                if (!findCoin) {
                    findCoin = await this.coinsRepository.save({
                        coin: coins.quoteTo,
                        fullname: getCotation.name.split('/')[1],
                        amount: 0,
                        address
                    });
                }

                await this.coinsRepository.update(
                    { id: findCoin.id },
                    { amount: Number(findCoin.amount) + Number(coins.value * getCotation.bid) }
                );

                const newTransaction = await this.transactionsRepository.save({
                    value: getCotation.bid * coins.value,
                    sendTo: address,
                    receiveFrom: address,
                    currentCotation: getCotation.bid,
                    coin_id: findCoin.id
                });
                return this.transactionsRepository.findOne({ id: newTransaction.id });
            })
        );
        return transactions;
    }

    async transferFunds(
        address: string,
        { receiverAddress, ...transferfundsDTO }: TransferFundsDTO
    ): Promise<Transactions> {
        const getCotation = await this.coinsService.findExternalData(transferfundsDTO);

        const findCoin = await this.coinsService.findOneCoin(address, transferfundsDTO.quoteTo);

        await this.validateTransfer(address, { receiverAddress, ...transferfundsDTO });

        let findReceiverCoin = await this.coinsService.findOneCoin(receiverAddress, transferfundsDTO.quoteTo);

        if (!findReceiverCoin) {
            findReceiverCoin = await this.coinsRepository.save({
                coin: transferfundsDTO.quoteTo,
                fullname: getCotation.name.split('/')[1],
                amount: 0,
                address: receiverAddress
            });
        }
        const data = {
            sendTo: receiverAddress,
            receiveFrom: address,
            currentCotation: Number(getCotation.bid)
        };

        const sender = await this.transactionsRepository.save({
            value: -transferfundsDTO.value * getCotation.bid,
            coin_id: findCoin.id,
            ...data
        });
        const receiver = await this.transactionsRepository.save({
            value: transferfundsDTO.value * getCotation.bid,
            coin_id: findReceiverCoin.id,
            ...data
        });

        await this.coinsRepository.update(
            { id: sender.coin_id },
            { amount: Number(findCoin.amount) + Number(sender.value) }
        );
        await this.coinsRepository.update(
            { id: receiver.coin_id },
            { amount: Number(findReceiverCoin.amount) + Number(receiver.value) }
        );

        const response = await this.transactionsRepository.findOne({
            where: { id: sender.id }
        });

        return response;
    }

    async getTransactionsHistory(address: string, querys: any): Promise<ITransactions[]> {
        const findTransactions = this.coinsRepository
            .createQueryBuilder('coins')
            .where('coins.address = :address', { address })
            .leftJoinAndSelect('coins.transactions', 'transactions');

        Object.keys(querys).forEach((query) => {
            const subquery = this.coinsRepository
                .createQueryBuilder('coins')
                .select('coins.id')
                .leftJoin('coins.transactions', 'transactions');
            subquery.andWhere(`${query} = :${query}`);
            subquery.setParameter(`${query}`, querys[query]);
            findTransactions.andWhere(`coins.id in (${subquery.getQuery()})`);
            findTransactions.setParameters(subquery.getParameters());
        });

        const serializedTransactions = transactionsSerializer(await findTransactions.getMany());

        if (serializedTransactions.length === 0) throw new NotFoundException('No transactions found for this wallet');

        return serializedTransactions;
    }

    async remove(address: string): Promise<void> {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Wallet address Not Found');

        await this.walletsRepository.delete(address);
    }

    private async validateFunds(address: string, data: AddFundsDTO[]): Promise<void[]> {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Wallet address Not Found');

        const validations = Promise.all(
            data.map(async (coins) => {
                const findCoin = await this.coinsService.findOneCoin(address, coins.quoteTo);

                const getCotation = await this.coinsService.findExternalData(coins);

                if (!findCoin && coins.value < 0)
                    throw new BadRequestException(`You cant deposit a coin with a negative value`);

                if (findCoin) {
                    if (Number(findCoin.amount) + Number(getCotation.bid * coins.value) < 0)
                        throw new BadRequestException(`No suficient funds for coin ${coins.currentCoin}`);
                }
            })
        );
        return validations;
    }

    private async validateTransfer(
        address: string,
        { receiverAddress, ...transferfundsDTO }: TransferFundsDTO
    ): Promise<void> {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Wallet address Not Found');

        const findReceiverAddress = await this.walletsRepository.findOne(receiverAddress);
        if (!findReceiverAddress) throw new NotFoundException('Receiver wallet address Not Found');

        const getCotation = await this.coinsService.findExternalData(transferfundsDTO);

        const findCoin = await this.coinsService.findOneCoin(address, transferfundsDTO.quoteTo);

        if (!findCoin || Number(findCoin.amount) < Number(transferfundsDTO.value * getCotation.bid))
            throw new BadRequestException(`You dont have funds of ${transferfundsDTO.currentCoin} to transfer`);
    }
}
