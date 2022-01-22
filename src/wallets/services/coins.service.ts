import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class CoinsService {
    constructor(private readonly httpService: HttpService) {}

    async findExternalData({ currentCoin, quoteTo }: UpdateWalletDto): Promise<any> {
        const responses = [];
        await this.httpService
            .get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`)
            .forEach((data) => responses.push(data.data[currentCoin + quoteTo]));
        return responses;
    }
}
