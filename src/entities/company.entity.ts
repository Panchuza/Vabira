// company.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @Column({ nullable: true })
  sitioWeb: string;

  @Column()
  descripcion: string;

  @Column()
  telefono: string;

  //falta relacion a turnero

}
