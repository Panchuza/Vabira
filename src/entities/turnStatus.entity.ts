import { Client } from 'src/entities/client.entity';
import { Type } from 'src/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Turn } from './turn.entity';

@Entity('TurnStatus')
export class TurnStatus {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @ManyToOne(() => Turn, (turn) => turn.turnStatus)
  @JoinColumn({ name: 'Turn_Id' })
  turn: Turn;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'TurnStatus_Type_Id' })
  turnStatusType: Type;

  @OneToOne(() => User, (user) => user.turnStatus)
  @JoinColumn({ name: 'StatusRegistration_User_Id' })
  statusRegistrationUser: User;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'TurnStatusReason_Type_Id' })
  turnStatusReasonType: Type;

  @Column({ name: 'StatusRegistrationDateTime', type: 'datetime', nullable: false })
  statusRegistrationDateTime: string;
}










