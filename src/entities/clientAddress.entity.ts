import { IsEmail } from "class-validator";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";
import { Country } from "./country.entity";
import { Client } from "./client.entity";
import { Type } from "./type.entity";

@Entity('ClientAddress')
export class ClientAddress {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number;

    @ManyToOne(() => Client, (client) => client.clientAddress)
    @JoinColumn({ name: 'Client_Id' })
    client: Client;

    @ManyToOne(() => Address, (address) => address.clientAddress, {cascade: true})
    @JoinColumn({ name: 'Address_Id' })
    address: Address;
}