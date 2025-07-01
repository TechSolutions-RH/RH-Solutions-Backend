import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findByCpf(cpf: string) {
    return this.usersRepository.findOneBy({ cpf });
  }

  async create(createUserDto: CreateUserDto) {
    // Validar formato de CPF
    if (!this.isValidCpfFormat(createUserDto.cpf)) {
      throw new BadRequestException('CPF deve estar no formato 000.000.000-00');
    }

    // Verificar se CPF já existe
    const existingUserByCpf = await this.findByCpf(createUserDto.cpf);
    if (existingUserByCpf) {
      throw new ConflictException(`Usuário com CPF ${createUserDto.cpf} já existe`);
    }

    // Verificar se email já existe
    const existingUserByEmail = await this.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Usuário com email ${createUserDto.email} já existe`);
    }

    // Validar complexidade da senha
    if (!this.isValidPassword(createUserDto.password)) {
      throw new BadRequestException(
        'Senha deve conter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    await this.usersRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // Métodos de validação
  private isValidCpfFormat(cpf: string): boolean {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  }

  private isValidPassword(password: string): boolean {
    if (password.length < 8) return false;
    
    // Verificar se contém letra maiúscula
    if (!/[A-Z]/.test(password)) return false;
    
    // Verificar se contém letra minúscula
    if (!/[a-z]/.test(password)) return false;
    
    // Verificar se contém número
    if (!/\d/.test(password)) return false;
    
    // Verificar se contém caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
  }
}