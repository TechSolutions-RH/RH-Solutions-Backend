import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Invite } from './entities/invite.entity';
import { InviteStatus } from './enum/invite-status.enum';
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

  async create(createInviteDto: CreateInviteDto, userId: number) {
    
    const existingInvite = await this.invitesRepository.findOne({
      where: { email: createInviteDto.email },
    });

    if (existingInvite && existingInvite.status === InviteStatus.PENDING) {
      throw new ConflictException(`Já existe um convite pendente para ${createInviteDto.email}`);
    }

    const existingUser = await this.usersService.findByEmail(createInviteDto.email);
    if (existingUser) {
      throw new ConflictException(`Já existe um usuário com o email ${createInviteDto.email}`);
    }

    const inviter = await this.usersService.findOne(userId);
    
    const token = randomBytes(32).toString('hex');
    
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

  async findOne(id: number) {
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

  async update(id: number, updateInviteDto: UpdateInviteDto) {
    await this.invitesRepository.update(id, updateInviteDto);
    return this.findOne(id);
  }

  async markAsCompleted(id: number) {
    await this.invitesRepository.update(id, { 
      status: InviteStatus.COMPLETED 
    });
    return this.findOne(id);
  }

  async markAsExpired(id: number) {
    await this.invitesRepository.update(id, { 
      status: InviteStatus.EXPIRED 
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const invite = await this.findOne(id);
    if (!invite) {
      throw new NotFoundException(`Convite com ID ${id} não encontrado`);
    }
    await this.invitesRepository.remove(invite);
    return { id };
  }
}
