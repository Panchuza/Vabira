import { TypeConfig } from 'src/entities/typeConfig.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Binary, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('Type')
export class Type {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'Name' })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'Code' })
  code: string;
  
  @ManyToOne(() => TypeConfig, (typeConfig) => typeConfig.type)
  @JoinColumn({ name: 'TypeConfig_Id' })
  typeConfig: TypeConfig;
  
  @Column({ type: 'smallint', nullable: false, name: 'Order' })
  order: string;

  @Column({ type: 'varchar', length: 500, nullable: false, name: 'Description' })
  description: string;
  
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'Icon' })
  icon: string;

  @Column({ type: 'bit', nullable: false, name: 'IsDefault' })
  isDefault: boolean;
}