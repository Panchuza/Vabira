import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Region } from "./region.entity";
import { Type } from "./type.entity";

@Entity('Continent')
export class Continent {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @Column({ name: 'Name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'Initials', type: 'varchar', length: 10, nullable: true })
  initials: string;

  @Column({ name: 'Active', type: 'bit', nullable: false })
  active: boolean;

  @OneToMany(() => Country, (country) => country.continent)
  country: Country[]

  @OneToMany(() => Region, (region) => region.continent)
  region: Region[]

}
