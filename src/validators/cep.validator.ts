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
          if (!value) return true; 
          if (typeof value !== 'string') return false;

          const cleanCep = value.replace(/\D/g, '');
          
          return cleanCep.length === 8;
        },
        defaultMessage() {
          return 'CEP deve ter 8 dígitos';
        },
      },
    });
  };
}

export function cleanCep(cepWithMask: string | null | undefined): string {
  if (typeof cepWithMask !== 'string') {
    return '';
  }
  return cepWithMask.replace(/\D/g, '');
}