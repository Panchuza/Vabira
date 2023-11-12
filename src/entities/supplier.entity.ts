import { Type } from "./type.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, BeforeUpdate, BeforeInsert } from "typeorm"
import { User } from "./user.entity";
import { SupplierStatus } from "./supplierStatus.entity";
import { PurchaseRecord } from "./purchaseRecord.entity";
import { SaleRecord } from "./saleRecord.entity";
import { Turn } from "./turn.entity";
import { Turnero } from "./turnero.entity";
import { Schedule } from "./schedule.entity";

@Entity('Supplier')
export class Supplier {

	@PrimaryGeneratedColumn('increment', { name: 'Id' })
	id: number;

	@OneToOne(() => User, (user) => user.supplier, { cascade: true })
	@JoinColumn({ name: 'User_Id' })
	user: User;

	@OneToOne(() => Type)
	@JoinColumn({ name: 'SupplierType_Type_Id' })
	supplierType: Type;

	@Column({ type: 'nvarchar', length: 15, nullable: true, name: 'IdentificationNumber' })
	identificationNumber: string;

	@Column({ type: 'varchar', length: 256, nullable: true, name: 'Cuit' })
	cuit: string;

	@Column({ name: 'CreateDateTime', type: 'datetime', nullable: true })
	createDateTime: string;

	@Column({ name: 'UploadDateTime', type: 'datetime', nullable: true })
	uploadDateTime: string;

	@OneToMany(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.supplier)
	purchaseRecord: PurchaseRecord[];

	@OneToOne(() => SaleRecord, (saleRecord) => saleRecord.supplier)
	saleRecord: SaleRecord;

	@OneToOne(() => Turnero, (turnero) => turnero.supplier)
	turnero: Turnero;

	@OneToMany(() => Schedule, (schedule) => schedule.supplier)
	schedule: Schedule

	@OneToMany(() => SupplierStatus, (supplierStatus) => supplierStatus.supplier, { cascade: true, eager: true })
	supplierStatus: SupplierStatus[];

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