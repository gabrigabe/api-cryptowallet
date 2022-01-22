import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import Coins from './coins.entity';

@Entity('Transactions')
export default class Transactions {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'money' })
    value!: number;

    @Column()
    datetime: Date;

    @Column()
    sendto!: string;

    @Column()
    receivefrom!: string;

    @Column()
    coin_id!: string;

    @ManyToOne(() => Coins, (coins) => coins.id)
    @JoinColumn({ name: 'coin_id' })
    coin: Coins;
}
