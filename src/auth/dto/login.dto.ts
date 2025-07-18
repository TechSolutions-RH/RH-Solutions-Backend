import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsValidCPF } from '../../validators/cpf.validator';

export class LoginDto {
  @ApiProperty({
    example: '12345678901',
    description: 'CPF do usuário (apenas números ou com máscara)',
  })
  @IsValidCPF()
  cpf: string;

  @ApiProperty({
    example: 'SenhaForte123!',
    description: 'Senha do usuário',
  })
  @IsString()
  password: string;
}