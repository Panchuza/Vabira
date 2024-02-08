import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { ClientStatus } from './clientStatus.entity';
import { Profiles } from './profile.entity';
import { Client } from './client.entity';
import { Supplier } from './supplier.entity';
import { Faq } from './faq.entity';
import { SupplierStatus } from './supplierStatus.entity';
import { Schedule } from './schedule.entity';
import { SignStatus } from './signStatus.entity';
import { Sign } from './sign.entity';
import { TurnStatus } from './turnStatus.entity';
import { ProfileUser } from './profileUser.entity';
import { UserStatus } from './userStatus.entity';

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 60, nullable: false, name: 'Username' })
  username: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: false, name: 'FirstName' })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: false, name: 'LastName' })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 256, nullable: false, name: 'Email' })
  email: string;

  @Column( {type: 'varchar'})
  roles: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'Avatar' })
  avatar: string;

  @ApiProperty()
  @Column({ type: 'bit', nullable: true, name: 'Active' })
  active: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 128, nullable: false, name: 'Password' })
  password: string;

  @ApiProperty()
  @Column({ type: 'datetime', nullable: true, name: 'CreatedAt' })
  createdAt: string;

  @ApiProperty()
  @Column({ type: 'datetime', nullable: true, name: 'LastLogin' })
  lastLogin: Date;

  @ApiProperty()
  @Column({ type: 'int', nullable: true, name: 'SessionOpen' })
  sessionOpen: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 36, nullable: true, name: 'ActivationKey' })
  activationKey: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 4096, nullable: true, name: 'Token' })
  token: string;

  @ApiProperty()
  @Column({ name: 'TokenEmitDate', type: 'datetime', nullable: true })
  tokenEmitDate: Date;

  @Column({ name: 'Dni', type: 'varchar', length: 15, nullable: true })
  dni: string;

  @Column({ name: 'DateOfBirth', type: 'date', nullable: true })
  dateOfBirth: string;

  @OneToOne(() => ClientStatus, (clientStatus) => clientStatus.statusRegistrationUser)
  clientStatus: ClientStatus;

  @OneToOne(() => TurnStatus, (turnStatus) => turnStatus.statusRegistrationUser)
  turnStatus: TurnStatus;

  @OneToOne(() => Client, (client) => client.user)
  client: Client;

  @OneToOne(() => Faq, (faq) => faq.user)
  faq: Faq;

  @OneToOne(() => Sign, (sign) => sign.user)
  sign: Sign;

  @OneToMany(() => ProfileUser, (profileUser) => profileUser.user, {cascade: true})
  profileUser: ProfileUser[]

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier: Supplier;

  @OneToOne(() => SupplierStatus, (supplierStatus) => supplierStatus.statusRegistrationUser)
  supplierStatus: SupplierStatus;

  @OneToOne(() => SignStatus, (signStatus) => signStatus.statusRegistrationUser)
  signStatus: SignStatus;

  @OneToMany(() => UserStatus, (userStatus) => userStatus.user, { cascade: true, eager: true })
	userStatus: UserStatus[];

}