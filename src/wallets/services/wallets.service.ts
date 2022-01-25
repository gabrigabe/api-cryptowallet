import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { AddFundsDTO } from '../dto/addFunds.dto';
import Coins from '../entities/coins.entity';
import Transactions from '../entities/transactions.entity';
import Wallet from '../entities/wallet.entity';
import { CoinsService } from './coins.service';
import { TransferFundsDTO } from '../dto/transferFunds.dto';

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

    async create(createWalletDto: CreateWalletDto) {
        const uniqueCheck = await this.walletsRepository.findOne({ cpf: createWalletDto.cpf });

        if (uniqueCheck) throw new BadRequestException(`cpf ${createWalletDto.cpf} already exists`);

        const newWallet = await this.walletsRepository.save(createWalletDto);
        return instanceToPlain(newWallet);
    }

    async findAll(query: any) {
        const allWallets = await this.walletsRepository.find({
            where: query
        });
        return allWallets;
    }

    async findOne(address: string): Promise<Record<string, undefined>> {
        const oneWallet = await this.walletsRepository.findOne({
            where: {
                address
            }
        });
        if (!oneWallet) throw new NotFoundException('Wallet address Not Found');

        return instanceToPlain(oneWallet);
    }

    async updateFunds(address: string, addFundsDTO: AddFundsDTO[]) {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Wallet address Not Found');

        await this.validateFunds(address, addFundsDTO);

        const transactions = await Promise.all(
            addFundsDTO.map(async (coins) => {
                const getCotation = await this.coinsService.findExternalData(coins);

                const findCoin = await this.coinsService.findOneCoin(address, coins.quoteTo);

                if (!findCoin) {
                    const addCoin = await this.coinsRepository.save({
                        name: coins.quoteTo,
                        fullname: getCotation.name.split('/')[1],
                        amount: getCotation.bid * coins.value,
                        address
                    });
                    const newTransaction = await this.transactionsRepository.save({
                        value: getCotation.bid * coins.value,
                        sendTo: address,
                        receiveFrom: address,
                        currentCotation: getCotation.bid,
                        coin_id: addCoin.id
                    });
                    return this.transactionsRepository.findOne({ id: newTransaction.id });
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
        return instanceToPlain(transactions);
    }

    async transferFunds(address: string, { receiverAddress, ...transferfundsDTO }: TransferFundsDTO) {
        const getCotation = await this.coinsService.findExternalData(transferfundsDTO);

        const findCoin = await this.coinsService.findOneCoin(address, transferfundsDTO.quoteTo);

        await this.validateTransfer(address, { receiverAddress, ...transferfundsDTO });

        let findReceiverCoin = await this.coinsService.findOneCoin(receiverAddress, transferfundsDTO.quoteTo);

        if (!findReceiverCoin) {
            findReceiverCoin = await this.coinsRepository.save({
                name: transferfundsDTO.quoteTo,
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

    async remove(address: string): Promise<void> {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Wallet address Not Found');

        await this.walletsRepository.delete(address);
    }

    async validateFunds(address: string, data: AddFundsDTO[]) {
        const validate = Promise.all(
            data.map(async (coins) => {
                const findCoin = await this.coinsService.findOneCoin(address, coins.quoteTo);

                const getCotation = await this.coinsService.findExternalData(coins);

                if (!findCoin && coins.value < 0)
                    throw new BadRequestException(`You cant deposit or transfer a coin with a negative value`);

                if (findCoin) {
                    if (Number(findCoin.amount) + Number(getCotation.bid * coins.value) < 0)
                        throw new BadRequestException(`No suficient funds for coin ${coins.currentCoin}`);
                }
            })
        );

        return validate;
    }

    async validateTransfer(address: string, { receiverAddress, ...transferfundsDTO }: TransferFundsDTO) {
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
