import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Product } from "./product.entity";
import { Supplier } from "./supplier.entity";
import { Client } from "./client.entity";

@Entity('SaleRecord')
export class SaleRecord {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'SaleDateTime', type: 'datetime', nullable: true })
	saleDateTime: string;

    @Column({ name: 'SaleAmount', type: 'decimal', precision: 8, scale: 2, nullable: true })
    saleAmount: number

    @Column({ name: 'Quantity', nullable: true })
    quantity: number

    // @OneToOne(() => Type)
    // @JoinColumn({ name: 'Product_Type_Id' })
    // productType: Type

    @ManyToOne(() => Client, (client) => client.saleRecord)
    @JoinColumn({ name: 'Client_Id' })
    client: Client;

    @ManyToOne(() => Supplier, (supplier) => supplier.saleRecord)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @OneToMany(() => Product, (product) => product.saleRecord)
    @JoinColumn({ name: 'Product_Id' })
    product: Product[];

}