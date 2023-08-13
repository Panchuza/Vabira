import { Client } from 'src/entities/client.entity';
import { Type } from 'src/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('ClientStatus')
export class ClientStatus {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @OneToOne(() => Client, (client) => client.clientStatus)
  @JoinColumn({ name: 'Client_Id' })
  client: Client;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'ClientStatus_Type_Id' })
  clientStatusType: Type;

  @OneToOne(() => User, (user) => user.clientStatus)
  @JoinColumn({ name: 'StatusRegistration_User_Id' })
  statusRegistrationUser: User;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'ClientStatusReason_Type_Id' })
  clientStatusReasonType: Type;

  @Column({ name: 'StatusRegistrationDateTime', type: 'datetime', nullable: false })
  statusRegistrationDateTime: string;
}










