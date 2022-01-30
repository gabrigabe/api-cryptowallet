import { IsNotEmpty, IsNumber, IsString, IsUppercase } from 'class-validator';

export class AddFundsDTO {
    @IsString()
    @IsUppercase()
    @IsNotEmpty()
    readonly quoteTo!: string;

    @IsString()
    @IsUppercase()
    @IsNotEmpty()
    readonly currentCoin!: string;

    @IsNumber()
    @IsNotEmpty()
    readonly value!: number;
}
