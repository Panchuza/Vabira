import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService,) {}

  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  @Get('findAll')
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get('findAllForSupplier')
  findAllForSupplier(@Query('id') id: string, @Query('userType') userType: string) {
    return this.scheduleService.findAllForSupplier(+id, userType);
  }

  @Get('findOne')
  findOne(@Query('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch('/delete')
  remove(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.remove(updateScheduleDto);
  }
  @Post('syncWithGoogleCalendar')
  async syncWithGoogleCalendar(@Body() data: {reservedTurns: any, calendarId: any }) {

    const reservedTurns = data.reservedTurns; // Ajusta según tu estructura de datos
    const calendarId = data.calendarId;
    
    await this.scheduleService.syncWithGoogleCalendar(reservedTurns, calendarId);

    return { message: 'Sincronización exitosa' };
  }
}
