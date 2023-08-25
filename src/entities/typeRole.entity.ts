import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity({name: "TypeRole"})
export class TypeRole {

  @PrimaryGeneratedColumn({name: 'Cod_type_role'})
  codTypeRole: number;

  @ApiProperty({example: '1'})
  @Column({name: 'Txt_type_role'})
  txtTypeRole: string;
}