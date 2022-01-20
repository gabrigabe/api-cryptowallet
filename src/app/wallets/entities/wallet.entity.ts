import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Wallets')
export default class Wallet {
    @PrimaryGeneratedColumn('uuid')
    address!: string;

    @Column()
    name!: string;

    @Column()
    cpf!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
