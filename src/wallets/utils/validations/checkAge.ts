import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'AgeChecker', async: false })
export class AgeChecker implements ValidatorConstraintInterface {
    validate(data: string): boolean {
        let date = moment(data, 'DD/MM/YYYY').format('DD/MM/YYYY');

        date = moment(date, 'DD/MM/YYYY').toISOString();

        const age = moment().diff(date, 'years');
        const checker = age >= 18;

        return checker;
    }

    defaultMessage(): string {
        return 'You need to be at least 18 years old to have a wallets';
    }
}
