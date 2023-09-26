import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";
import { Continent } from "./continent.entity";
import { Client } from "./client.entity";
import { PoliticalDivision } from "./politicalDivision.entity";
import { Region } from "./region.entity";
import { Type } from "./type.entity";

@Entity('Country')
export class Country {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @ManyToOne(() => Region, (region) => region.country)
  @JoinColumn({ name: 'Region_Id' })
  region: Region;

  @Column({ name: 'Name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'Initials', type: 'varchar', length: 10, nullable: true })
  initials: string;

  @Column({ name: 'Nationality', type: 'varchar', length: 20, nullable: false })
  nationality: string;

  @Column({ name: 'Active', type: 'bit', nullable: false })
  active: boolean;

  @ManyToOne(() => Continent, (continent) => continent.country)
  @JoinColumn({ name: 'Continent_Id' })
  continent: Continent;

  @OneToMany(() => PoliticalDivision, (politicalDivision) => politicalDivision.country)
  politicalDivision: PoliticalDivision[]

  @OneToOne(() => Client, (client) => client.countryOfOrigin)
  clientOrigin: Client;

  @OneToOne(() => Client, (client) => client.countryOfResidence)
  clientResidence: Client;

  @OneToOne(() => Address, (address) => address.country)
  address: Address;

}
