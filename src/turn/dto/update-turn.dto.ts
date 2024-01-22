import { PartialType } from '@nestjs/swagger';
import { CreateTurnDto } from './create-turn.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTurnDto extends PartialType(CreateTurnDto) {

    @IsOptional()
    id: number

    // @IsNumber()
    signPay: number

}
