import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseUUIDPipe,
    Put,
    Query,
    ParseArrayPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpCode
} from '@nestjs/common';
import { WalletsService } from '../services/wallets.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { AddFundsDTO } from '../dto/addFunds.dto';
import { TransferFundsDTO } from '../dto/transferFunds.dto';

@Controller('api/v1/wallet')
@UseInterceptors(ClassSerializerInterceptor)
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @Post()
    create(@Body() createWalletDto: CreateWalletDto) {
        return this.walletsService.create(createWalletDto);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.walletsService.findAll(query);
    }

    @Get(':address')
    findOne(@Param('address', ParseUUIDPipe) address: string) {
        return this.walletsService.findOne(address);
    }

    @Put(':address')
    async updateFunds(
        @Param('address', ParseUUIDPipe) address: string,
        @Body(
            new ParseArrayPipe({
                items: AddFundsDTO
            })
        )
        addFundsDTO: AddFundsDTO[]
    ) {
        return this.walletsService.updateFunds(address, addFundsDTO);
    }

    @Post(':address/transaction')
    async transferFunds(@Param('address', ParseUUIDPipe) address: string, @Body() transferFundsDTO: TransferFundsDTO) {
        return this.walletsService.transferFunds(address, transferFundsDTO);
    }

    @HttpCode(204)
    @Delete(':address')
    remove(@Param('address', ParseUUIDPipe) address: string) {
        return this.walletsService.remove(address);
    }
}
