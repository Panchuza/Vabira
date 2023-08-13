import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";

@Entity('Accesses')
export class Accesses {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number;

    @OneToOne(() => Type)
	@JoinColumn({ name: 'Access_Type_Id' })
    accessType: Type;

    @Column({ name: 'Name', type: 'varchar', length: 60, nullable: false })
    name: string;

    @Column({ name: 'Code', type: 'varchar', length: 50, nullable: false })
    code: string;

    @Column({ name: 'Description', type: 'varchar', length: 500, nullable: true })
    description: string;

    @Column({ name: 'Method', type: 'varchar', length: 500, nullable: true })
    method: string;

    @Column({ name: 'Url', type: 'varchar', length: 500, nullable: true })
    url: string;

    @Column({ name: 'Posicion', type: 'int', nullable: false })
    posicion: number;

    @Column({ name: 'IconClass', type: 'varchar', length: 60, nullable: true })
    iconClass: string;

    @Column({ name: 'ParentId', type: 'varchar', length: 60, nullable: true })
    parent: string;
}
