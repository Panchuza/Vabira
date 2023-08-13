import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseRecord } from "./purchaseRecord.entity";
import { SaleRecord } from "./saleRecord.entity";

@Entity('Receipt')
export class Receipt {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'ReceiptDateTime', type: 'datetime', nullable: true })
    receiptDateTime: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'File' })
    file: string;

    @OneToOne(() => PurchaseRecord, (purchaseRecord) => purchaseRecord.receipt)
    @JoinColumn({ name: 'PurchaseRecord_Id' })
    purchaseRecord: PurchaseRecord;

    @OneToOne(() => SaleRecord, (saleRecord) => saleRecord.receipt)
    @JoinColumn({ name: 'SaleRecord_Id' })
    saleRecord: SaleRecord;

}