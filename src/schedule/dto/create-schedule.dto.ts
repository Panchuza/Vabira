import { IsNotEmpty, IsOptional } from "class-validator";
import { Supplier } from "src/entities/supplier.entity";
import { Type } from "src/entities/type.entity";

export class CreateScheduleDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    turnDuration: string;

    @IsNotEmpty()
    initialTurnDateTime: string;

    @IsNotEmpty()
    finalTurnDateTime: string;

    @IsNotEmpty()
    hasSign: boolean;

    classDayType: Type

    @IsOptional()
    turnero: string;

    @IsOptional()
    supplier: Supplier;

}
