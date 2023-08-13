import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "./alert.entity";
import { Client } from "./client.entity";
import { Supplier } from "./supplier.entity";
import { Report } from "./report.entity";
import { TurnAttentionDay } from "./turnAttentionDay.entity";
import { Schedule } from "./schedule.entity";

@Entity('Turnero')
export class Turnero {

    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'InitialDateTurn', type: 'datetime', nullable: true })
    initialDateTurn: string;

    @Column({ name: 'FinalDateTurn', type: 'datetime', nullable: true })
    finalDateTurn: string;

    @OneToOne(() => Supplier, (supplier) => supplier.turnero)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier

    @OneToOne(() => Schedule, (schedule) => schedule.turnero)
    @JoinColumn({ name: 'Schedule_Id' })
    schedule: Schedule

}