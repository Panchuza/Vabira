import { Type } from 'src/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Sign } from './sign.entity';

@Entity('SignStatus')
export class SignStatus {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @OneToOne(() => Sign, (sign) => sign.signStatus)
  @JoinColumn({ name: 'Sign_Id' })
  sign: Sign;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'SignStatus_Type_Id' })
  signStatusType: Type;

  @OneToOne(() => User, (user) => user.signStatus)
  @JoinColumn({ name: 'StatusRegistration_User_Id' })
  statusRegistrationUser: User;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'SignStatusReason_Type_Id' })
  signStatusReasonType: Type;

  @Column({ name: 'StatusRegistrationDateTime', type: 'datetime', nullable: false })
  statusRegistrationDateTime: string;
}










