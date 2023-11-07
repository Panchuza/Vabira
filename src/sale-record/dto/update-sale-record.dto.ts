import { PartialType } from '@nestjs/swagger';
import { CreateSaleRecordDto } from './create-sale-record.dto';
import { IsNumber } from 'class-validator';

export class UpdateSaleRecordDto extends PartialType(CreateSaleRecordDto) {
    @IsNumber()
    id?: number
}
