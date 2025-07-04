import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;  

  @Column({ nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COLLABORATOR,
  })
  role: UserRole;

  @Column({ nullable: true })
  cep: string;

  @Column({ nullable: true })
  state: string;  

  @Column({ nullable: true })
  city: string;   

  @Column({ nullable: true })
  neighborhood: string;  

  @Column({ nullable: true })
  street: string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}