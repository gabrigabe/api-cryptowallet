import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class CoinsService {
    constructor(private readonly httpService: HttpService) {}

    async findExternalData({ currentCoin, quoteTo }: UpdateWalletDto): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService.get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`)
        );

        return data[currentCoin + quoteTo];
    }
}
