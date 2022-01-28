import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength, Validate } from 'class-validator';
import { AgeChecker } from '../utils/validations/checkAge';
import { CpfChecker } from '../utils/validations/checkCPF';
import { DateChecker } from '../utils/validations/checkDate';

export class CreateWalletDto {
    @IsString()
    @MinLength(7)
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    readonly name!: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    @IsNotEmpty()
    @Validate(CpfChecker)
    readonly cpf!: string;

    @IsString()
    @IsNotEmpty()
    @Validate(DateChecker)
    @Validate(AgeChecker)
    readonly birthdate!: string;
}
