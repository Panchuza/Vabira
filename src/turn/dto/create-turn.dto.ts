import { IsNotEmpty, IsOptional } from "class-validator";
import { Alert } from "src/entities/alert.entity";
import { Schedule } from "src/entities/schedule.entity";
import { Report } from "src/entities/report.entity";
import { TurnStatus } from "src/entities/turnStatus.entity";
import { Client } from "src/entities/client.entity";
import { TurnAttentionDay } from "src/entities/turnAttentionDay.entity";
import { Supplier } from "src/entities/supplier.entity";

export class CreateTurnDto {

    @IsNotEmpty()
    dateFrom: string;

    @IsNotEmpty()
    dateTo: string;

    @IsOptional()
    alert: Alert

    @IsOptional()
	report: Report;

    @IsOptional()
	schedule: Schedule;

    @IsOptional()
    turnStatus: TurnStatus[]

    @IsOptional()
    client: Client

    @IsOptional()
    supplier: Supplier

    @IsOptional()
    turnAttentionDay: TurnAttentionDay




}
