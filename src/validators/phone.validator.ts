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
          if (!value) return true; 
          if (typeof value !== 'string') return false;

          const cleanPhone = value.replace(/\D/g, '');
          
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
  if (!phoneWithMask) {
    return '';
  }
  return phoneWithMask.replace(/\D/g, '');
}