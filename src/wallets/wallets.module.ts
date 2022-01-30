import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WalletsService } from './services/wallets.service';
import { WalletsController } from './controller/wallets.controller';
import { CoinsService } from './services/coins.service';
import Wallet from './entities/wallet.entity';
import Coins from './entities/coins.entity';
import Transactions from './entities/transactions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet, Coins, Transactions]), HttpModule],
    controllers: [WalletsController],
    providers: [WalletsService, CoinsService]
})
export class WalletsModule {}
