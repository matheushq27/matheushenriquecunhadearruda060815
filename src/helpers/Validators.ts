import { keepOnlyNumbers } from './Formatters';
import { cpf } from 'cpf-cnpj-validator';

export function validateCPF(cpfValue: string) {
    if(!cpfValue) return false;
    return cpf.isValid(keepOnlyNumbers(cpfValue));
}