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
    ClassSerializerInterceptor
} from '@nestjs/common';
import { WalletsService } from '../services/wallets.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { AddFundsDTO } from '../dto/addFunds.dto';

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

    @Delete(':address')
    remove(@Param('address', ParseUUIDPipe) address: string) {
        return this.walletsService.remove(address);
    }
}
