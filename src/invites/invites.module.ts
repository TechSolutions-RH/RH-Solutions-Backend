import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { Invite } from './entities/invite.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite]),
    UsersModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
