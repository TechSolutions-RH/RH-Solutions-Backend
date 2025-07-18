import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';
import { IsEmail, IsString, IsOptional, Matches, MinLength } from 'class-validator';
import { IsValidCPF } from '../../validators/cpf.validator';
import { IsValidPhone } from '../../validators/phone.validator';
import { IsValidCEP } from '../../validators/cep.validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;
  
  @ApiProperty({
    example: 'joaodasilva@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: '13133573080',
    description: 'CPF do usuário (apenas números ou com máscara)',
  })
  @IsValidCPF()
  cpf: string;

  @ApiProperty({
    example: '11912345678',
    description: 'Telefone do usuário (apenas números ou com máscara)',
  })
  @IsOptional()
  @IsValidPhone()
  phone?: string;

  @ApiProperty({
    example: 'SenhaForte123!',
    description: 'Senha do usuário',
  })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  password: string;

  @ApiProperty({
    example: 'collaborator',
    description: 'Papel do usuário',
    enum: UserRole,
  })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example: '01310100',
    description: 'CEP do usuário (apenas números ou com máscara)',
  })
  @IsOptional()
  @IsValidCEP()
  cep?: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado do usuário',
  })
  @IsOptional()
  state?: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade do usuário',
  })
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Bairro do usuário',
  })
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({
    example: 'Avenida Paulista, 1000',
    description: 'Logradouro do usuário',
  })
  @IsOptional()
  street?: string;
}