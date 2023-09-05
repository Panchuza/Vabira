import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator"
import { IsNumber, IsObject } from "class-validator"
import { Client } from "src/entities/client.entity"

export class ReportProjection{
    @IsOptional()
    @IsString()
    dateFrom: string;
    @IsOptional()
    @IsString()
    dateTo: string;
    @IsOptional()
    @IsNumber()
    clientId:number
    @IsOptional()
    @IsNumber()
    statusId:number
    @IsOptional()
    @IsNumber()
    userId:number

}