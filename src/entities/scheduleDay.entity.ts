import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity('ScheduleDay')
export class ScheduleDay {

    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'Description' })
    description: string

    // @OneToOne(() => Schedule, (schedule) => schedule.scheduleDay)
    schedule: Schedule


}