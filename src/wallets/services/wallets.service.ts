import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import Coins from '../entities/coins.entity';
import Wallet from '../entities/wallet.entity';
import { CoinsService } from './coins.service';

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletsRepository: Repository<Wallet>,
        @InjectRepository(Coins)
        private readonly coinsRepository: Repository<Coins>,

        private readonly coinsService: CoinsService
    ) {}

    async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
        const uniqueCheck = await this.walletsRepository.findOne({ cpf: createWalletDto.cpf });

        if (uniqueCheck) throw new BadRequestException(`cpf ${createWalletDto.cpf} already exists`);

        const newWallet = await this.walletsRepository.save(createWalletDto);
        return newWallet;
    }

    async findAll() {
        const allWallets = await this.walletsRepository.find({ relations: ['coins', 'coins.transactions'] });
        return allWallets;
    }

    async findOne(address: string) {
        return `This action returns a #${address} wallet`;
    }

    async update(address: string, updateWalletDto: UpdateWalletDto[]) {
        const findAddress = await this.walletsRepository.findOne(address);

        if (!findAddress) throw new NotFoundException('Address Not Found');
        await Promise.all(
            updateWalletDto.map(async (coins) => {
                const getCotation = await this.coinsService.findExternalData(coins);
                const findCoin = await this.coinsRepository.findOne({
                    where: {
                        address,
                        name: coins.quoteTo
                    }
                });
                if (!findCoin && coins.value > 0) {
                    const addCoin = await this.coinsRepository.save({
                        name: coins.quoteTo,
                        fullname: getCotation.name.split('/')[1],
                        amount: getCotation.bid * coins.value,
                        address
                    });
                }
            })
        );
        return 'ok';
    }

    async remove(address: string) {
        return `This action removes a #${address} wallet`;
    }
}
