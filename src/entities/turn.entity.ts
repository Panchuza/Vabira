import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "./alert.entity";
import { Client } from "./client.entity";
import { Supplier } from "./supplier.entity";
import { Report } from "./report.entity";
import { Schedule } from "./schedule.entity";
import { TurnStatus } from "./turnStatus.entity";
import { Type } from "./type.entity";

@Entity('Turn')
export class Turn {

    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'DateFrom', type: 'datetime', nullable: true })
    dateFrom: string;

    @Column({ name: 'DateTo', type: 'datetime', nullable: true })
    dateTo: string;

    @OneToOne(() => Alert, (alert) => alert.turn, {cascade: true})
    alert: Alert

    @OneToOne(() => Report, (report) => report.turn)
	report: Report;

    @ManyToOne(() => Schedule, (schedule) => schedule.turn, {orphanedRowAction: 'delete'})
    @JoinColumn({ name: 'Schedule_Id' })
	schedule: Schedule;

    @OneToMany(() => TurnStatus, (turnStatus) => turnStatus.turn, {cascade: true})
    turnStatus: TurnStatus[]

    @ManyToOne(() => Client, (client) => client.turn)
    @JoinColumn({ name: 'Client_Id' })
    client: Client

    @ManyToOne(() => Type)
    @JoinColumn({ name: 'ClassDay_Type_Id' })
    classDayType: Type;

}