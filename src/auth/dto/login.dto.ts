import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '123.456.789-01',
    description: 'CPF do usuário no formato 000.000.000-00',
  })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @ApiProperty({
    example: 'SenhaForte123!',
    description: 'Senha do usuário',
  })
  @IsString()
  password: string;
}