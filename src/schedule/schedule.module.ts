import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { TurnService } from 'src/turn/turn.service';
import { Turn } from 'src/entities/turn.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { TypeService } from 'src/type/type.service';
import { Type } from 'src/entities/type.entity';
import { TurnStatus } from 'src/entities/turnStatus.entity';
import { User } from 'src/entities/user.entity';
import { Client } from 'src/entities/client.entity';
import { SignStatus } from 'src/entities/signStatus.entity';
import { GoogleCalendarService } from './google-calendar.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Schedule, Turn, Supplier, Type, TurnStatus, User, Client, SignStatus]),],
  controllers: [ScheduleController],
  providers: [ScheduleService, TurnService, TypeService,GoogleCalendarService]
})
export class ScheduleModule {}
