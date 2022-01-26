import Coins from 'src/wallets/entities/coins.entity';
import { ITransactions } from 'src/wallets/interfaces/wallet.interface';

export const transactionsSerializer = (coins: Coins[]): ITransactions[] => {
    const transactions: ITransactions[] = [];
    coins.map((coin) => {
        const transaction = {
            coin: coin.name,
            transactions: coin.transactions
        };

        return transactions.push(transaction);
    });
    return transactions;
};
