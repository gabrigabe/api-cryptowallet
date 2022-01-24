import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AddFundsDTO } from './addFunds.dto';

export class TransferFundsDTO extends PartialType(AddFundsDTO) {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    readonly receiverAddress?: string;
}
