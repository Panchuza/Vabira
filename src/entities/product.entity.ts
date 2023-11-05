import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { PurchaseRecord } from "./purchaseRecord.entity";
import { SaleRecord } from "./saleRecord.entity";
import { Report } from "./report.entity";
import { Schedule } from "./schedule.entity";

@Entity('Product')
export class Product {
   @PrimaryGeneratedColumn('increment', { name: 'Id' })
   id: number

   @Column({ name: 'Name' })
   name: string

   @Column({ name: 'Code' })
   code: string

   @Column({ name: 'Brand' })
   brand: string

   @Column({ name: 'Description' })
   description: string

   @Column({ name: 'Quantity' })
   quantity: number

   @Column({ name: 'Prize', type: 'decimal', precision: 8, scale: 2, nullable: true })
   prize: number

   @Column({ name: 'Stock' })
   stock: number

   @Column({ name: 'caducityDatetime', type: 'date' })
   caducityDatetime: string

   // @Column({ name: 'Image' })
   // image: string

   @OneToOne(() => Report, (report) => report.product)
	report: Report;

   @OneToOne(() => Type)
   @JoinColumn({ name: 'Product_Type_Id' })
   productType: Type

   @OneToOne(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.product)
   purchaseRecord: PurchaseRecord;

   @OneToOne(() => SaleRecord, (saleRecord) => saleRecord.product)
   saleRecord: SaleRecord;


}