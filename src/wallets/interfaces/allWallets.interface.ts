import Coins from '../entities/coins.entity';

export interface IWallets {
    wallet: [
        {
            name: string;
            cpf: string;
            birthdate: string;
            address: string;
            coins?: Coins[];
            createdAt: Date;
            updatedAt: Date;
        }
    ];
}
