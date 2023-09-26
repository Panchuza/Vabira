import { Module } from '@nestjs/common';
import { PoliticalDivisionService } from './political-division.service';
import { PoliticalDivisionController } from './political-division.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliticalDivision } from 'src/entities/politicalDivision.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PoliticalDivision])],
  controllers: [PoliticalDivisionController],
  providers: [PoliticalDivisionService]
})
export class PoliticalDivisionModule {}
