import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { ClientAddress } from "./clientAddress.entity";
import { PoliticalDivision } from "./politicalDivision.entity";
import { Supplier } from "./supplier.entity";
import { Type } from "./type.entity";

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @Column({ name: 'Address', type: 'varchar', length: 100, nullable: false })
  address: string;

  @OneToOne(() => Type)
  @JoinColumn({ name: 'Address_Type_Id' })
  addressType: Type;

  @OneToOne(() => Country, (country) => country.address)
  @JoinColumn({ name: 'Country_Id' })
  country: Country;

  @OneToOne(() => PoliticalDivision, (politicalDivision) => politicalDivision.country)
  @JoinColumn({ name: 'PoliticalDivision_Id' })
  politicalDivision: PoliticalDivision;

  @Column({ name: 'PostalCode', type: 'varchar', length: 10, nullable: true })
  postalCode: string;

  @Column({ name: 'Phone', type: 'nvarchar', length: 15, nullable: true })
  phone: string

  @OneToOne(() => ClientAddress, (clientAddress) => clientAddress.address)
  clientAddress: ClientAddress;

}
