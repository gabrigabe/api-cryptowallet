import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import Wallet from './entities/wallet.entity';

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletsRepository: Repository<Wallet>,
        private readonly httpService: HttpService
    ) {}

    async create(createWalletDto: CreateWalletDto) {
        const uniqueCheck = await this.walletsRepository.find({ cpf: createWalletDto.cpf });

        if (uniqueCheck) throw new BadRequestException(`cpf ${createWalletDto.cpf} already exists`);
        const newWallet = await this.walletsRepository.save(createWalletDto);
        return newWallet;
    }

    async findAll() {
        const allWallets = await this.walletsRepository.find();
        return allWallets;
    }

    async findOne(address: string) {
        return `This action returns a #${address} wallet`;
    }

    async update(address: string, updateWalletDto: UpdateWalletDto): Promise<Observable<any>> {
        const algo = this.httpService
            .get(
                `https://economia.awesomeapi.com.br/json/last/${updateWalletDto.currentCoin}-${updateWalletDto.quoteTo}`
            )
            .pipe(map((response) => response.data));

        console.log(address);
        return algo;
    }

    async remove(address: string) {
        return `This action removes a #${address} wallet`;
    }
}
