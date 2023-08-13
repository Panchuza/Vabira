import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Profiles } from "./profile.entity";
import { User } from "./user.entity";

@Entity('ProfileUser')
export class ProfileUser {
   @PrimaryColumn({name: 'ProfilesId'})
   profileId: number

   @PrimaryColumn({name: 'UsersId'})
   userId: number

   @ManyToOne(profile => Profiles, profile => profile.profileUser)
   @JoinColumn({ name: 'Profiles_Id' })
   profiles: Profiles

   @ManyToOne(user => User, user => user.profileUser)
   @JoinColumn({ name: 'User_Id' })
   user: User
}
