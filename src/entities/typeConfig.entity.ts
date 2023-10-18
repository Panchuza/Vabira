import { Type } from 'src/entities/type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Binary, OneToMany, OneToOne } from 'typeorm';

@Entity('TypeConfig')
export class TypeConfig {
  @PrimaryGeneratedColumn('increment', {name:'Id'})
  id: number;

  @Column({type: 'varchar', length: 100, nullable: false, name:'Name'})
  name: string;
  
  @Column({type: 'varchar', length: 50, nullable: false, name:'Code'})
  code: string;

  @Column({type: 'varchar', length: 500, nullable: false, name:'Description'})
  description: string;

  @Column({type: 'smallint', nullable: false, name:'Order'})
  order: string;

  @Column({type: 'bit', nullable: false, name:'hasIcon'})
  hasIcon: boolean;
  
  @Column({type: 'bit', nullable: false, name:'hasUniqueCode'})
  hasUniqueCode: boolean;

  @OneToMany(() => Type, (type) => type.typeConfig)
  type: Type[]
}