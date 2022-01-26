import Wallets from 'src/wallets/entities/wallet.entity';
import { IWallets } from 'src/wallets/interfaces/allWallets.interface';

export const serializeOneWallet = (wallet: Wallets): Wallets => ({
    name: wallet.name,
    cpf: wallet.cpf,
    birthdate: wallet.birthdate,
    address: wallet.address,
    coins: wallet.coins,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt
});

export const serializeAllWallet = (wallets: Wallets[]): IWallets[] => {
    const allWallets: IWallets[] = [];
    wallets.map((wallet) => {
        const aWallet: IWallets = {
            wallet: [serializeOneWallet(wallet)]
        };

        return allWallets.push(aWallet);
    });
    return allWallets;
};
