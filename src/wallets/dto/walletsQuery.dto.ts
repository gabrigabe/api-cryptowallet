import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class WalletsQueryDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    cpf?: string;

    @IsString()
    @IsOptional()
    birthdate?: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    'wallets.address': string;

    @IsString()
    @IsOptional()
    'coins.coin': string;

    @IsString()
    @IsOptional()
    'coins.fullname': string;

    @IsNumber()
    @IsOptional()
    'coins.amount': Number;
}
