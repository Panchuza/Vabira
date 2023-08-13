import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('Faq')
export class Faq {
   @PrimaryGeneratedColumn('increment', {name:'Id'})
   id: number

   @Column({name: 'Name'})
   name: string

   @Column({name: 'Description'})
   description: string

   @OneToOne(() => User, (user) => user.faq)
   @JoinColumn({ name: 'UserRegistration_Id' })
   user: User
}