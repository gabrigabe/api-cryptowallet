import { Exclude, Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import Coins from './coins.entity';

@Entity('Transactions')
export default class Transactions {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Type(() => Number)
    @Column({ type: 'numeric' })
    value!: number;

    @CreateDateColumn()
    datetime: Date;

    @Column()
    sendTo!: string;

    @Column()
    receiveFrom!: string;

    @Type(() => Number)
    @Column({ type: 'numeric' })
    currentCotation!: number;

    @Exclude()
    @Column()
    coin_id!: string;

    @ManyToOne(() => Coins, (coins) => coins.id)
    @JoinColumn({ name: 'coin_id' })
    coin: Coins;
}
