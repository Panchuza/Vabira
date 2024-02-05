import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Supplier } from "./supplier.entity";
import { Turn } from "./turn.entity";
import { Turnero } from "./turnero.entity";

@Entity('Schedule')
export class Schedule {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'Name', type: 'varchar', nullable: true })
    name: string;

    @Column({ name: 'Alias', type: 'varchar', nullable: true })
    alias: string;

    @Column({ name: 'InitialTurnDateTime', type: 'datetime', nullable: true })
    initialTurnDateTime: string;

    @Column({ name: 'FinalTurnDateTime', type: 'datetime', nullable: true })
    finalTurnDateTime: string;

    @Column({ name: 'TurnDuration', type: 'int', nullable: true })
    turnDuration: number;

    @Column({ name: 'HasSign', nullable: true })
    hasSign: boolean;

    @OneToMany(() => Turn, (turn) => turn.schedule, {cascade: true})
    turn: Turn[]

    @ManyToOne(() => Supplier, (supplier) => supplier.schedule)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @ManyToOne(() => Turnero, (turnero) => turnero.schedule)
    turnero: Turnero;

    @Column({ name: 'Active', type: 'bit', nullable: true })
    active: boolean
}