// update-company.dto.ts

import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  nombre: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  direccion: string;

  @IsOptional()
  sitioWeb: string;

  @IsOptional()
  descripcion: string;

  @IsOptional()
  telefono: string;
}
