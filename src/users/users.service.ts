import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cleanCpf } from '../validators/cpf.validator';
import { cleanPhone } from '../validators/phone.validator';
import { cleanCep } from '../validators/cep.validator';
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

  async findOne(id: number) {
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
    const cleanedCpf = cleanCpf(cpf);
    return this.usersRepository.findOneBy({ cpf: cleanedCpf });
  }

  async create(createUserDto: CreateUserDto) {
    const cleanedCpf = cleanCpf(createUserDto.cpf);
    const cleanedPhone = createUserDto.phone ? cleanPhone(createUserDto.phone) : undefined;
    const cleanedCep = createUserDto.cep ? cleanCep(createUserDto.cep) : undefined;

    const existingUserByCpf = await this.findByCpf(cleanedCpf);
    if (existingUserByCpf) {
      throw new ConflictException(`Usuário com CPF ${createUserDto.cpf} já existe`);
    }

    const existingUserByEmail = await this.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Usuário com email ${createUserDto.email} já existe`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      cpf: cleanedCpf,
      phone: cleanedPhone,
      cep: cleanedCep,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };
    
    if (updateData.cpf) {
      updateData.cpf = cleanCpf(updateData.cpf);
    }
    
    if (updateData.phone) {
      updateData.phone = cleanPhone(updateData.phone);
    }
    
    if (updateData.cep) {
      updateData.cep = cleanCep(updateData.cep);
    }
    
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const result = await this.usersRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { id: user.id, message: 'Usuário removido com sucesso' };
  }
}