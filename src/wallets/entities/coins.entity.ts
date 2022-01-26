import { Exclude, Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import Transactions from './transactions.entity';
import Wallets from './wallet.entity';

@Entity('Coins')
export default class Coins {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    coin!: string;

    @Column()
    fullname!: string;

    @Type(() => Number)
    @Column({ type: 'numeric' })
    amount!: number;

    @Exclude()
    @Column()
    address!: string;

    @ManyToOne(() => Wallets, (wallets) => wallets.address)
    @JoinColumn({ name: 'address' })
    wallet!: Wallets;

    @OneToMany(() => Transactions, (transaction) => transaction.coin, {
        eager: true
    })
    transactions: Transactions[];
}
