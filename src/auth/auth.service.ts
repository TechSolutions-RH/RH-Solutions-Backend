import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { cleanCpf } from '../validators/cpf.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const cleanedCpf = cleanCpf(loginDto.cpf);
    const user = await this.usersService.findByCpf(cleanedCpf);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const userWithPassword = await this.usersService['usersRepository'].findOne({
      where: { id: user.id },
      select: ['id', 'password', 'role', 'name', 'email', 'cpf'],
    });

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
