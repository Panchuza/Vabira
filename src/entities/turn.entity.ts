import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "./alert.entity";
import { Client } from "./client.entity";
import { Supplier } from "./supplier.entity";
import { Report } from "./report.entity";
import { TurnAttentionDay } from "./turnAttentionDay.entity";
import { Schedule } from "./schedule.entity";
import { TurnStatus } from "./turnStatus.entity";

@Entity('Turn')
export class Turn {

    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'DateFrom', type: 'datetime', nullable: true })
    dateFrom: string;

    @Column({ name: 'DateTo', type: 'datetime', nullable: true })
    dateTo: string;

    @OneToOne(() => Alert, (alert) => alert.turn)
    alert: Alert

    @OneToOne(() => Report, (report) => report.turn)
	report: Report;

    @OneToOne(() => Schedule, (schedule) => schedule.turn)
	schedule: Schedule;

    @OneToOne(() => TurnStatus, (turnStatus) => turnStatus.turn)
    turnStatus: TurnStatus[]

    @OneToOne(() => Client, (client) => client.turn)
    @JoinColumn({ name: 'Client_Id' })
    client: Client

    @OneToOne(() => Supplier, (supplier) => supplier.turn)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier

    @OneToOne(() => TurnAttentionDay, (turnAttentionDay) => turnAttentionDay.turn)
    @JoinColumn({ name: 'TurnAttentionDay_Id' })
    turnAttentionDay: TurnAttentionDay


}