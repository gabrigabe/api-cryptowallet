import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'AgeChecker', async: false })
export class CpfChecker implements ValidatorConstraintInterface {
    validate(data: string): boolean {
        if (typeof data !== 'string') return false;
        const cpf = data.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        const cpfA = cpf.split('').map((el) => +el);
        const rest = (count: number) =>
            ((cpfA.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;
        const valid = rest(10) === cpfA[9] && rest(11) === cpfA[10];
        return valid;
    }

    defaultMessage(): string {
        return 'Invalid CPF';
    }
}
