import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByCpf(loginDto.cpf);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Carregar a senha do usuário (que está com select: false)
    const userWithPassword = await this.usersService['usersRepository'].findOne({
      where: { id: user.id },
      select: ['id', 'password', 'role', 'name', 'email', 'cpf'],
    });

    // Verificar se o usuário com senha foi encontrado
    if (!userWithPassword || !userWithPassword.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      cpf: user.cpf,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
    };
  }
}
