import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToOne(() => Client, (client) => client.purchaseRecord)
    @JoinColumn({ name: 'Client_Id' })
    client: Client;

    @OneToOne(() => Supplier, (supplier) => supplier.purchaseRecord)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @OneToOne(() => Product, (product) => product.purchaseRecord)
    @JoinColumn({ name: 'Product_Id' })
    product: Product;

    @OneToOne(() => Receipt, (receipt) => receipt.purchaseRecord)
	receipt: Receipt;

}