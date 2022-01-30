import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AddFundsDTO } from './addFunds.dto';

export class TransferFundsDTO extends AddFundsDTO {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    readonly receiverAddress?: string;
}
