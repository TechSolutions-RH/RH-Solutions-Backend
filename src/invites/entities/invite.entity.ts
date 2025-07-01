import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InviteStatus {
  PENDING = 'pending',    // Em aberto
  COMPLETED = 'completed', // Finalizado
  EXPIRED = 'expired',     // Vencido
}

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  token: string;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  invitedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}