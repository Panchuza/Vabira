import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Product } from "./product.entity";
import { Supplier } from "./supplier.entity";
import { Client } from "./client.entity";
import { Receipt } from "./receipt.entity";

@Entity('PurchaseRecord')
export class PurchaseRecord {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'PurchaseDateTime', type: 'datetime', nullable: true })
	purchaseDateTime: string;

    @Column({ name: 'PurchaseAmount', type: 'decimal', precision: 8, scale: 2, nullable: true })
    purchaseAmount: number

    @OneToOne(() => Type)
    @JoinColumn({ name: 'Product_Type_Id' })
    productType: Type

    @ManyToOne(() => Supplier, (supplier) => supplier.purchaseRecord)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @OneToMany(() => Product, (product) => product.purchaseRecord)
    product: Product[];

    @OneToOne(() => Receipt, (receipt) => receipt.purchaseRecord)
	receipt: Receipt;

    @BeforeInsert()
	insertRegistraionDate() {
		this.purchaseDateTime = this.formatDate(new Date())
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