import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./profile.entity";
import { User } from "./user.entity";

@Entity('ProfileUser')
export class ProfileUser {
   @PrimaryGeneratedColumn('increment',{name: 'id'})
   id: number

   @ManyToOne(() => User, (user) => user.profileUser)
   @JoinColumn({name: 'user_Id'})
   user: User

   @ManyToOne(() => Profiles, (profile) => profile.profileUser)
   @JoinColumn({name: 'profile_Id'})
   profile: Profiles

}
