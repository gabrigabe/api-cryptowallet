import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import Wallet from './entities/wallet.entity';

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletsService: Repository<Wallet>
    ) {}

    async create(createWalletDto: CreateWalletDto) {
        const newWallet = await this.walletsService.save(createWalletDto);
        return newWallet;
    }

    findAll() {
        return `This action returns all wallets`;
    }

    findOne(id: number) {
        return `This action returns a #${id} wallet`;
    }

    update(id: number, updateWalletDto: UpdateWalletDto) {
        return `This action updates a #${id} wallet`;
    }

    remove(id: number) {
        return `This action removes a #${id} wallet`;
    }
}
