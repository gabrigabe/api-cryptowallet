import Transactions from '../entities/transactions.entity';

export interface ITransactions {
    coin: string;
    transactions: Transactions[];
}
