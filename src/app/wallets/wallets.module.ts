import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import Wallet from './entities/wallet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet]), HttpModule],
    controllers: [WalletsController],
    providers: [WalletsService]
})
export class WalletsModule {}
