import { IsString, Matches, MinLength, Validate } from 'class-validator';
import { AgeChecker } from '../utils/validations/checkAge';
import { DateChecker } from '../utils/validations/checkDate';

export class CreateWalletDto {
    @IsString()
    @MinLength(7)
    readonly name!: string;

    @IsString()
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    readonly cpf!: string;

    @IsString()
    @Validate(DateChecker)
    @Validate(AgeChecker)
    readonly birthdate!: string;
}
