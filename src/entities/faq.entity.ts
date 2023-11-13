import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('Faq')
export class Faq {
   @PrimaryGeneratedColumn('increment', {name:'Id'})
   id: number

   @Column({ name: 'Name', default: 'Default Name' })
   name: string;
   

   @Column({name: 'Description', length: 1000})
   description: string //respuesta

   @OneToOne(() => User, (user) => user.faq)
   @JoinColumn({ name: 'UserRegistration_Id' })
   user: User
}