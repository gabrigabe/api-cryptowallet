import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AddFundsDTO } from '../dto/addFunds.dto';
import Coins from '../entities/coins.entity';
import { GetData } from '../interfaces/getData.interface';

@Injectable()
export class CoinsService {
    constructor(
        @InjectRepository(Coins)
        private readonly coinsRepository: Repository<Coins>,

        private readonly httpService: HttpService
    ) {}

    async findExternalData({ currentCoin, quoteTo }: AddFundsDTO): Promise<GetData> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`)
            );

            return data[currentCoin + quoteTo];
        } catch (error) {
            throw new NotFoundException(`Inexistent or unsupported transaction ${currentCoin}-${quoteTo}`);
        }
    }

    async findOneCoin(address: string, data: string): Promise<Coins> {
        const findCoin = this.coinsRepository.findOne({
            where: {
                address,
                name: data
            }
        });
        return findCoin;
    }
}
