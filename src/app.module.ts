import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { WalletsModule } from './wallets/wallets.module';

@Module({
    imports: [
        WalletsModule,
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
                Object.assign(await getConnectionOptions(), {
                    autoLoadEntities: true
                })
        })
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
