import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import Transactions from './transactions.entity';
import Wallets from './wallet.entity';

@Entity('Coins')
export default class Coins {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    fullname!: string;

    @Column({ type: 'numeric' })
    amount!: number;

    @Column()
    address!: string;

    @ManyToOne(() => Wallets, (wallets) => wallets.address)
    @JoinColumn({ name: 'address' })
    wallet!: Wallets;

    @OneToMany(() => Transactions, (transaction) => transaction.coin)
    transactions: Transactions[];
}
