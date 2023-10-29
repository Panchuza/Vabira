import { PartialType } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';
import { IsOptional } from 'class-validator';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {


    @IsOptional()
    id?: number

}