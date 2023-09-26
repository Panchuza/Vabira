import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";

export class AssignDto {
    @IsNumber({maxDecimalPlaces: 0})
    @IsNotEmpty()
    id: number
}