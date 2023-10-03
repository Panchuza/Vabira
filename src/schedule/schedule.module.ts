import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { TurnService } from 'src/turn/turn.service';
import { Turn } from 'src/entities/turn.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Schedule, Turn, Supplier]),],
  controllers: [ScheduleController],
  providers: [ScheduleService, TurnService]
})
export class ScheduleModule {}
