import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Supplier } from "src/entities/supplier.entity";
import { Turnero } from "src/entities/turnero.entity";
import { Type } from "src/entities/type.entity";

export class CreateScheduleDto {

    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({ each: true })
    days: string[]; // Los días seleccionados por el usuario
  
    @IsString()
    initialTurnDateTime: string; // Hora de inicio del horario laboral
  
    @IsString()
    finalTurnDateTime: string; // Hora de finalización del horario laboral
  
    @IsInt()
    turnDuration: number; // Duración de cada turno en minutos

    // @IsNotEmpty()
    hasSign: boolean;

    classDayType: Type

    @IsOptional()
    turnero: Turnero;

    @IsOptional()
    supplier: Supplier;

}
