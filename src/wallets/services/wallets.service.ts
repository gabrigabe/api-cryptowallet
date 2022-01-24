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

        const newWallet = await this.walletsRepository.save(createWalletDto);
        return newWallet;
    }

    async findAll(query: any) {
        const allWallets = await this.walletsRepository.find({
            relations: ['coins', 'coins.transactions'],
            where: query
        });
        return instanceToPlain(allWallets);
    }

    async findOne(address: string) {
        return `This action returns a #${address} wallet`;
    }

    async updateFunds(address: string, addFundsDTO: AddFundsDTO[]): Promise<Transactions[]> {
        const findAddress = await this.walletsRepository.findOne(address);
        if (!findAddress) throw new NotFoundException('Address Not Found');

        await this.validateFunds(address, addFundsDTO);

        const transactions = await Promise.all(
            addFundsDTO.map(async (coins) => {
                const getCotation = await this.coinsService.findExternalData(coins);
                const findCoin = await this.coinsRepository.findOne({
                    where: {
                        address,
                        name: coins.quoteTo
                    }
                });

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
                    return newTransaction;
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
                return newTransaction;
            })
        );
        return transactions;
    }

    async remove(address: string) {
        return `This action removes a #${address} wallet`;
    }

    async validateFunds(address: string, data: AddFundsDTO[]) {
        const validate = Promise.all(
            data.map(async (coins) => {
                const findCoin = await this.coinsRepository.findOne({
                    where: {
                        address,
                        name: coins.quoteTo
                    }
                });
                const getCotation = await this.coinsService.findExternalData(coins);

                if (!findCoin && coins.value < 0)
                    throw new BadRequestException(`You cant deposit a coin with a negative value`);

                if (findCoin) {
                    if (Number(findCoin.amount) + Number(getCotation.bid * coins.value) < 0)
                        throw new BadRequestException(`No suficient funds for coin ${coins.currentCoin}`);
                }
            })
        );

        return validate;
    }
}
