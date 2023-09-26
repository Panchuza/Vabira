import { ClientStatus } from 'src/entities/clientStatus.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Turn } from './turn.entity';
import { PurchaseRecord } from './purchaseRecord.entity';
import { SaleRecord } from './saleRecord.entity';
import { Schedule } from './schedule.entity';
import { ClientAddress } from './clientAddress.entity';
import { Country } from './country.entity';

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

  @OneToOne(() => Country, (country) => country.clientOrigin)
  @JoinColumn({ name: 'CountryOfOrigin_Id' })
  countryOfOrigin: Country;

  @OneToOne(() => Country, (country) => country.clientResidence)
  @JoinColumn({ name: 'CountryOfResidence_Id' })
  countryOfResidence: Country;

  @OneToOne(() => ClientStatus, (clientStatus) => clientStatus.client)
  clientStatus: ClientStatus[]

  @OneToOne(() => Turn, (turn) => turn.client)
  turn: Turn

  @OneToOne(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.client)
  purchaseRecord: PurchaseRecord;

  @OneToOne(() => SaleRecord, (saleRecord) => saleRecord.client)
  saleRecord: SaleRecord;

  @OneToMany(() => ClientAddress, (clientAddress) => clientAddress.client, { cascade: true, eager: true })
  clientAddress: ClientAddress[]

}










