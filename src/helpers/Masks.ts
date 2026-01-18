import { keepOnlyNumbers } from "./Formatters";

export function maskPhone(value: string): string {
  if (!value) return '';

  // remove tudo que não for número
  const digits = keepOnlyNumbers(value);

  // celular: (99) 99999-9999 → 11 dígitos
  if (digits.length === 11) {
    return digits.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3'
    );
  }

  // fixo: (99) 9999-9999 → 10 dígitos
  if (digits.length === 10) {
    return digits.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3'
    );
  }
  return digits;
}

export function maskCPF(value: string | number): string {
  if (!value) return '';

  // remove tudo que não for número
  const digits = keepOnlyNumbers(value.toString());

  // limita a 11 dígitos
  const limited = digits.slice(0, 11);

  // aplica a máscara progressivamente
  if (limited.length <= 3) {
    return limited;
  }

  if (limited.length <= 6) {
    return limited.replace(/^(\d{3})(\d+)/, '$1.$2');
  }

  if (limited.length <= 9) {
    return limited.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  }

  return limited.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

