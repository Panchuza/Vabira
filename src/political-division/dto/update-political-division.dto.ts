import { PartialType } from '@nestjs/swagger';
import { CreatePoliticalDivisionDto } from './create-political-division.dto';

export class UpdatePoliticalDivisionDto extends PartialType(CreatePoliticalDivisionDto) {}
