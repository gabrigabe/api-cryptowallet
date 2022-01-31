import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class TransactionQueryDTO {
    @IsString()
    @IsOptional()
    coin: string;

    @IsNumber()
    @IsOptional()
    'transactions.value': Number;

    @IsDate()
    @IsOptional()
    'transactions.datetime': Date;

    @IsString()
    @IsUUID()
    @IsOptional()
    'transactions.receiveFrom': string;

    @IsString()
    @IsUUID()
    @IsOptional()
    'transactions.sendTo': string;

    @IsNumber()
    @IsOptional()
    'transactions.currentCotation': Number;
}
