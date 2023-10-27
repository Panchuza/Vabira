import { ClientStatus } from 'src/entities/clientStatus.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
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

  @OneToOne(() => ClientStatus, (clientStatus) => clientStatus.client)
  clientStatus: ClientStatus[]

  @OneToMany(() => Turn, (turn) => turn.client)
  turn: Turn[]

  @OneToOne(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.client)
  purchaseRecord: PurchaseRecord;

  @OneToOne(() => SaleRecord, (saleRecord) => saleRecord.client)
  saleRecord: SaleRecord;

  @OneToMany(() => ClientAddress, (clientAddress) => clientAddress.client, { cascade: true, eager: true })
  clientAddress: ClientAddress[]

  @BeforeInsert()
    insertRegistraionDate() {
        this.createDateTime = this.formatDate(new Date())
    }

	@BeforeUpdate()
	private addUploadDate() {
		this.uploadDateTime = this.formatDate(new Date())
	}
	private padTo2Digits(num: number) {
		return num.toString().padStart(2, '0');
	}

	private formatDate(date: Date) {
		return (
			[
				date.getFullYear(),
				this.padTo2Digits(date.getMonth() + 1),
				this.padTo2Digits(date.getDate()),
			].join('-') +
			' ' +
			[
				this.padTo2Digits(date.getHours()),
				this.padTo2Digits(date.getMinutes()),
				this.padTo2Digits(date.getSeconds()),
			].join(':')
		);
	}

}










