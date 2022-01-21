import { IsString, Matches, MinLength } from 'class-validator';

export class CreateWalletDto {
    @IsString()
    @MinLength(7)
    readonly name!: string;

    @IsString()
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    readonly cpf!: string;

    @IsString()
    @Matches(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    readonly birthdate!: string;
}
