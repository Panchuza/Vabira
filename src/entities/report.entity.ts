import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseRecord } from "./purchaseRecord.entity";
import { SaleRecord } from "./saleRecord.entity";
import { Product } from "./product.entity";
import { Turn } from "./turn.entity";

@Entity('Report')
export class Report {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'Name' })
    name: string

    @Column({ name: 'Description' })
    description: string

    @OneToOne(() => Product, (product) => product.report)
    @JoinColumn({ name: 'Product_Id' })
    product: Product;

    @OneToOne(() => Turn, (turn) => turn.report)
    @JoinColumn({ name: 'Turn_Id' })
    turn: Turn

}