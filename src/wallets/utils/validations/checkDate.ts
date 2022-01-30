import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'AgeChecker', async: false })
export class DateChecker implements ValidatorConstraintInterface {
    validate(data: string): boolean {
        const date = moment(data, 'DD/MM/YYYY').format('DD/MM/YYYY');

        if (date === 'Invalid date') return false;

        return true;
    }

    defaultMessage(): string {
        return 'Invalid date';
    }
}
