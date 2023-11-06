import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProfileUser } from "./profileUser.entity";
import { AccessProfile } from "./accessProfile.entity";
import { ProfileType } from "./profileType.entity";

@Entity('Profiles')
export class Profiles {
   @PrimaryGeneratedColumn('increment', {name: 'id'})
   id: number

   @Column({name: 'name', length: 80})
   name: string

   @OneToMany(() => AccessProfile, (accessProfile) => accessProfile.profile, {cascade: true})
   accessProfile: AccessProfile[]

   @OneToMany(() => ProfileUser, (profileUser) => profileUser.profile)
   profileUser: ProfileUser[]
}