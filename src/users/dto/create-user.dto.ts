import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';
import { IsEmail, IsString, IsOptional, Matches, MinLength } from 'class-validator';

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
    example: '123.456.789-01',
    description: 'CPF do usuário no formato 000.000.000-00',
  })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @ApiProperty({
    example: '(11) 91234-5678',
    description: 'Telefone do usuário no formato (00) 00000-0000',
  })
  @IsOptional()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (00) 00000-0000',
  })
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
    example: 'COLLABORATOR',
    description: 'Papel do usuário',
    enum: UserRole,
  })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example: '12345-678',
    description: 'CEP do usuário no formato 00000-000',
  })
  @IsOptional()
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000',
  })
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