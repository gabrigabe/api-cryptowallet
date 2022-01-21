import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import Coins from './coins.entity';

@Entity('Wallets')
export default class Wallets {
    @PrimaryGeneratedColumn('uuid')
    address!: string;

    @Column()
    name!: string;

    @Column()
    cpf!: string;

    @Column()
    birthdate!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Coins, (coins) => coins.wallet)
    coins!: Coins[];
}
