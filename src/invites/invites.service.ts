import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Invite, InviteStatus } from './entities/invite.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private invitesRepository: Repository<Invite>,
    private usersService: UsersService,
  ) {}

  async create(createInviteDto: CreateInviteDto, userId: string) {
    // Verificar se já existe convite para este email
    const existingInvite = await this.invitesRepository.findOne({
      where: { email: createInviteDto.email },
    });

    if (existingInvite && existingInvite.status === InviteStatus.PENDING) {
      throw new ConflictException(`Já existe um convite pendente para ${createInviteDto.email}`);
    }

    // Verificar se já existe usuário com este email
    const existingUser = await this.usersService.findByEmail(createInviteDto.email);
    if (existingUser) {
      throw new ConflictException(`Já existe um usuário com o email ${createInviteDto.email}`);
    }

    const inviter = await this.usersService.findOne(userId);
    
    // Gerar token aleatório
    const token = randomBytes(32).toString('hex');
    
    // Definir data de expiração (24h)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const invite = this.invitesRepository.create({
      email: createInviteDto.email,
      token,
      expiresAt,
      invitedBy: inviter,
      status: InviteStatus.PENDING,
    });
    
    return this.invitesRepository.save(invite);
  }

  async findAll() {
    return this.invitesRepository.find({
      relations: ['invitedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.invitesRepository.findOne({
      where: { id },
      relations: ['invitedBy'],
    });
  }

  async findByToken(token: string) {
    return this.invitesRepository.findOne({
      where: { token },
    });
  }

  async update(id: string, updateInviteDto: UpdateInviteDto) {
    await this.invitesRepository.update(id, updateInviteDto);
    return this.findOne(id);
  }

  async markAsCompleted(id: string) {
    await this.invitesRepository.update(id, { 
      status: InviteStatus.COMPLETED 
    });
    return this.findOne(id);
  }

  async markAsExpired(id: string) {
    await this.invitesRepository.update(id, { 
      status: InviteStatus.EXPIRED 
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const invite = await this.findOne(id);
    if (!invite) {
      throw new NotFoundException(`Convite com ID ${id} não encontrado`);
    }
    await this.invitesRepository.remove(invite);
    return { id };
  }
}
