import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProfileUser } from "./profileUser.entity";

@Entity('Profiles')
export class Profiles {
   @PrimaryGeneratedColumn('increment', {name:'Id'})
   id: number

   @Column({name: 'Name'})
   name: string

   @Column({name: 'StateId'})
   state: number

   @Column({name: 'Active'})
   active: boolean

   @OneToMany(profileUser =>ProfileUser, (profileUser) => profileUser.profiles )
   profileUser: ProfileUser[]
}