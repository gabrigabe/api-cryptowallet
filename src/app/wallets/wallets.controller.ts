import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('api/v1/wallet')
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @Post()
    create(@Body() createWalletDto: CreateWalletDto) {
        return this.walletsService.create(createWalletDto);
    }

    @Get()
    findAll() {
        return this.walletsService.findAll();
    }

    @Get(':address')
    findOne(@Param('address', ParseUUIDPipe) address: string) {
        return this.walletsService.findOne(address);
    }

    @Put(':address')
    async update(@Param('address', ParseUUIDPipe) address: string, @Body() updateWalletDto: UpdateWalletDto) {
        return this.walletsService.update(address, updateWalletDto);
    }

    @Delete(':address')
    remove(@Param('address', ParseUUIDPipe) address: string) {
        return this.walletsService.remove(address);
    }
}
