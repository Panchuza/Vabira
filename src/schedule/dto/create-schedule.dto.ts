import { IsNotEmpty, IsOptional } from "class-validator";
import { Supplier } from "src/entities/supplier.entity";
import { Turnero } from "src/entities/turnero.entity";
import { Type } from "src/entities/type.entity";

export class CreateScheduleDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    turnDuration: number;

    @IsNotEmpty()
    initialTurnDateTime: string;

    @IsNotEmpty()
    finalTurnDateTime: string;

    @IsNotEmpty()
    hasSign: boolean;

    classDayType: Type

    @IsOptional()
    turnero: Turnero;

    @IsOptional()
    supplier: Supplier;

}
