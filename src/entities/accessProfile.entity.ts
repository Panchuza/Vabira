import { Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Profiles } from "./profile.entity";

@Entity('AccessProfile')
export class AccessProfile {
   @PrimaryColumn({name: 'AccessId'})
   access: number

   @PrimaryColumn({name: 'ProfileId'})
   profile: number

   @ManyToOne(profile => Profiles, profile => profile.profileUser)
   profiles: Profiles
}
