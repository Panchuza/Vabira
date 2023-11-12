import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./profile.entity";
import { Access } from "./access.entity";

@Entity('AccessProfile')
export class AccessProfile {
   @PrimaryGeneratedColumn('increment', {name: 'id'})
   id: number

   @ManyToOne(()=> Profiles, (profile) => profile.accessProfile)
   @JoinColumn({name: 'profile_Id'})
   profile: Profiles

   @ManyToOne(() => Access, (access) => access.accessProfile)
   @JoinColumn({name: 'access_Id'})
   access: Access
}
