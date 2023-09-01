import { ClientStatus } from 'src/entities/clientStatus.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Turn } from './turn.entity';
import { PurchaseRecord } from './purchaseRecord.entity';
import { SaleRecord } from './saleRecord.entity';
import { Schedule } from './schedule.entity';

@Entity('Client')
export class Client {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @OneToOne(() => User, (user) => user.client, { cascade: true })
  @JoinColumn({ name: 'User_Id' })
  user: User;

  @Column({ name: 'CreateDateTime', type: 'datetime', nullable: true })
	createDateTime: string;

	@Column({ name: 'UploadDateTime', type: 'datetime', nullable: true })
	uploadDateTime: string;

  @OneToOne(() => ClientStatus, (clientStatus) => clientStatus.client)
  clientStatus: ClientStatus[]

  @OneToOne(() => Turn, (turn) => turn.client)
  turn: Turn

  @OneToOne(() => Schedule, (schedule) => schedule.client)
  schedule: Schedule

  @OneToOne(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.client)
  purchaseRecord: PurchaseRecord;

  @OneToOne(() => SaleRecord, (saleRecord) => saleRecord.client)
  saleRecord: SaleRecord;

}










