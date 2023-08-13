import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { Turn } from "./turn.entity";

@Entity('TurnAttentionDay')
export class TurnAttentionDay {

    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @OneToOne(() => Type)
    @JoinColumn({ name: 'TurnAttentionDay_Type_Id' })
    turnAttentionDay: Type

    @OneToOne(() => Turn, (turn) => turn.turnAttentionDay)
	turn: Turn;

}