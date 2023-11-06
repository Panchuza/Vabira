import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { AccessProfile } from "./accessProfile.entity";

@Entity('Access')
export class Access {
    @PrimaryGeneratedColumn('increment', {name: 'id'})
    id: number

    @Column({name: 'name', length: 50})
    name: string

    @Column({name: 'description', length: 50})
    description: string

    @Column({name: 'code', length: 50})
    code: string

    @Column({name: 'url', length: 2000, nullable: true})
    url: string

    @Column({name: 'order'})
    order: number

    @OneToMany(() => AccessProfile, (accessProfile) => accessProfile.access)
    accessProfile: AccessProfile[]
}
