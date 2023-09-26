import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Type } from "./type.entity";

@Entity('PoliticalDivision')
export class PoliticalDivision {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @Column({ name: 'Name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'Initials', type: 'varchar', length: 10, nullable: false })
  initials: string;

  @ManyToOne(() => Country, (country) => country.politicalDivision)
  @JoinColumn({ name: 'Country_Id' })
  country: Country;

  @ManyToOne(() => Type)
  @JoinColumn({ name: 'PoliticalDivision_Type_Id' })
  politicalDivisionType: Type;

  @Column({ name: 'Active', type: 'bit', nullable: false })
  active: boolean;
  
}
