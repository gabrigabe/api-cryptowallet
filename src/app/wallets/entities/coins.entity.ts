import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Wallets from './wallet.entity';

@Entity('Coins')
export default class Coins {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    fullname!: string;

    @Column()
    amount!: number;

    @Column()
    address!: string;

    @ManyToOne(() => Wallets, (wallets) => wallets.address)
    @JoinColumn({ name: 'address' })
    wallet!: Wallets;
}
