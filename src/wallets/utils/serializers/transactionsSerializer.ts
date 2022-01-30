import Coins from 'src/wallets/entities/coins.entity';
import { ITransactions } from 'src/wallets/interfaces/transactions.interface';

export const transactionsSerializer = (coins: Coins[]): ITransactions[] => {
    const transactions: ITransactions[] = [];
    coins.map((coin) => {
        const transaction: ITransactions = {
            coin: coin.coin,
            transactions: coin.transactions
        };

        return transactions.push(transaction);
    });
    return transactions;
};
