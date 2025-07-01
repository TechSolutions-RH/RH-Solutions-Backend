import { UserRole } from '../entities/user.entity';
import { IsEmail, IsString, IsOptional, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @IsOptional()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (00) 00000-0000',
  })
  phone?: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  password: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000',
  })
  cep?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  neighborhood?: string;

  @IsOptional()
  street?: string;
}