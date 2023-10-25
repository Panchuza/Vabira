// create-company.dto.ts

import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  sitioWeb: string;

  @IsNotEmpty()
  descripcion: string;

  @IsNotEmpty()
  telefono: string;
}
