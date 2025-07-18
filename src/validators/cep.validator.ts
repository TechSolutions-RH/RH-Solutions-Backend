import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidCEP(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCEP',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Opcional
          if (typeof value !== 'string') return false;

          // Remove máscara
          const cleanCep = value.replace(/\D/g, '');
          
          // Deve ter exatamente 8 dígitos
          return cleanCep.length === 8;
        },
        defaultMessage() {
          return 'CEP deve ter 8 dígitos';
        },
      },
    });
  };
}

export function cleanCep(cepWithMask: string): string {
  return cepWithMask.replace(/\D/g, '');
}