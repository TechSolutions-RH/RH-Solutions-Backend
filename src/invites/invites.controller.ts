import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('invites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR)
  create(@Body() createInviteDto: CreateInviteDto, @Request() req) {
    return this.invitesService.create(createInviteDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR)
  findAll() {
    return this.invitesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  update(@Param('id') id: string, @Body() updateInviteDto: UpdateInviteDto) {
    return this.invitesService.update(id, updateInviteDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  remove(@Param('id') id: string) {
    return this.invitesService.remove(id);
  }
}
