import { IsNotEmpty } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Double, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Continent } from './continent.entity';
import { Country } from './country.entity';

@Entity('Region')
export class Region {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number;

    @ManyToOne(() => Continent, (continent) => continent.region)
    @JoinColumn({ name: 'Continent_Id' })
    continent: Continent;

    @Column({ name: 'Name', type: 'varchar', length: 50, nullable: false })
    name: string;

    @IsNotEmpty()
    @Column({ name: 'Initials', type: 'varchar', length: 10, nullable: false })
    initials: string;

    @Column({ name: 'Active', type: 'bit', nullable: false })
    active: boolean;

    @OneToMany(() => Country, (country) => country.region)
    country: Country[];
}
