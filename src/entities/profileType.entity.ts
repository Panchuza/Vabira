import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./profile.entity";

@Entity({name: 'ProfileType'})
export class ProfileType{

    @PrimaryGeneratedColumn('increment', {name: 'id'})
    id: number

    @Column({name: 'name'})
    name: string

    // @OneToMany(() => Profiles, (profile) => profile.profileType)
    // profile: Profiles[]

}