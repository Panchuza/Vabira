import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Product } from "./product.entity";
import { Supplier } from "./supplier.entity";
import { Client } from "./client.entity";
import { Receipt } from "./receipt.entity";
import { Turn } from "./turn.entity";
import { User } from "./user.entity";
import { ScheduleDay } from "./scheduleDay.entity";
import { Turnero } from "./turnero.entity";

@Entity('Schedule')
export class Schedule {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'InitialTurnDateTime', type: 'datetime', nullable: true })
    initialTurnDateTime: string;

    @Column({ name: 'FinalTurnDateTime', type: 'datetime', nullable: true })
    finalTurnDateTime: string;

    @OneToOne(() => Product, (product) => product.schedule)
    @JoinColumn({ name: 'Product_Id' })
    product: Product;

    @OneToOne(() => Turn, (turn) => turn.schedule)
    @JoinColumn({ name: 'Turn_Id' })
    turn: Turn

    @OneToOne(() => Client, (client) => client.schedule)
    @JoinColumn({ name: 'Client_Id' })
    client: Client;

    @OneToOne(() => Turnero, (turnero) => turnero.schedule)
	turnero: Turnero;

    @OneToOne(() => ScheduleDay, (scheduleDay) => scheduleDay.schedule)
    @JoinColumn({ name: 'ScheduleDay_Id' })
    scheduleDay: ScheduleDay;
}