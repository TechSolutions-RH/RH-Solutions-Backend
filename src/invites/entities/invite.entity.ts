import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InviteStatus } from '../enum/invite-status.enum';


@Entity()
export class Invite {
  @PrimaryGeneratedColumn('identity')
  id: number;

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

export { InviteStatus };
