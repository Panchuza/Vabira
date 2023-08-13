import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Turn } from "./turn.entity";

@Entity('Alert')
export class Alert {
   @PrimaryGeneratedColumn('increment', {name:'Id'})
   id: number

   @Column({name: 'Name'})
   name: string

   @Column({name: 'Description'})
   description: string

   @OneToOne(() => Turn, (turn) => turn.alert)
   @JoinColumn({ name: 'Turn_Id' })
   turn: Turn
}