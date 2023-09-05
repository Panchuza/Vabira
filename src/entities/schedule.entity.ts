import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ name: 'InitialTurnDateTime', type: 'datetime', nullable: true })
    initialTurnDateTime: string;

    @Column({ name: 'FinalTurnDateTime', type: 'datetime', nullable: true })
    finalTurnDateTime: string;

    @Column({ name: 'TurnDuration', type: 'datetime', nullable: false })
    turnDuration: string;

    @Column({ name: 'HasSign', type: 'bit', nullable: false })
    hasSign: boolean;

    @OneToOne(() => Turn, (turn) => turn.schedule)
    @JoinColumn({ name: 'Turn_Id' })
    turn: Turn

    @OneToOne(() => Supplier, (supplier) => supplier.schedule)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @OneToOne(() => Turnero, (turnero) => turnero.schedule)
    turnero: Turnero;

    @OneToOne(() => Type)
    @JoinColumn({ name: 'ClassDay_Type_Id' })
    classDayType: Type;

}