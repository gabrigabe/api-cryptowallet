import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddFundsDTO } from '../dto/addFunds.dto';
import { GetData } from '../interfaces/getData.interface';

@Injectable()
export class CoinsService {
    constructor(private readonly httpService: HttpService) {}

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
}
