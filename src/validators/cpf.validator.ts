import { registerDecorator, ValidationOptions } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const cleanCpf = value.replace(/\D/g, '');

          return cpf.isValid(cleanCpf);
        },
        defaultMessage() {
          return 'CPF deve ser válido';
        },
      },
    });
  };
}

export function cleanCpf(cpfWithMask: string): string {
  return cpfWithMask.replace(/\D/g, '');
}