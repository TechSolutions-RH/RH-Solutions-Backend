import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',        // Administrador
  HR = 'hr',              // Gente e Cultura
  COLLABORATOR = 'collaborator', // Colaborador Comum
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;  // Adicionar campo de CPF

  @Column({ nullable: true })
  phone: string;  // Adicionar campo de telefone

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

  // Campos de endereço
  @Column({ nullable: true })
  cep: string;

  @Column({ nullable: true })
  state: string;  // UF

  @Column({ nullable: true })
  city: string;   // Localidade

  @Column({ nullable: true })
  neighborhood: string;  // Bairro

  @Column({ nullable: true })
  street: string;  // Logradouro

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}