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
    return this.usersRepository.findOneBy({ cpf });
  }

  async create(createUserDto: CreateUserDto) {

    const existingUserByCpf = await this.findByCpf(createUserDto.cpf);
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
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const result = await this.usersRepository.update(id, updateUserDto);

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