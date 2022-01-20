import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import * as moment from 'moment';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @Post()
    create(@Body() createWalletDto: CreateWalletDto) {
        /* const test = (createWalletDto.birthdate = moment(
      createWalletDto.birthdate,
      'DD/MM/YYYY',
    ).format('DD/MM/YYYY')); */
        console.log(createWalletDto);
        return this.walletsService.create(createWalletDto);
    }

    @Get()
    findAll() {
        return this.walletsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.walletsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
        return this.walletsService.update(+id, updateWalletDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.walletsService.remove(+id);
    }
}
