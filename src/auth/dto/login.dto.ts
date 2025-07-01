import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @IsString()
  password: string;
}