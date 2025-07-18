import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Opcional
          if (typeof value !== 'string') return false;

          // Remove máscara
          const cleanPhone = value.replace(/\D/g, '');
          
          // Deve ter 10 ou 11 dígitos (com ou sem 9 no celular)
          return cleanPhone.length === 10 || cleanPhone.length === 11;
        },
        defaultMessage() {
          return 'Telefone deve ter 10 ou 11 dígitos';
        },
      },
    });
  };
}

export function cleanPhone(phoneWithMask: string): string {
  return phoneWithMask.replace(/\D/g, '');
}