import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TurnService } from './turn.service';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { scheduled } from 'rxjs';

@Controller('turn')
export class TurnController {
  constructor(private readonly turnService: TurnService) {}

  @Get('findAllForSchedule')
  findAll(@Query('idSchedule') idSchedule: string   ) {
    return this.turnService.findAllForSchedule(+idSchedule);
  }

  @Get('findAssignTurnsForSchedule')
  findAssignTurnsForSchedule(@Query('scheduleId') scheduleId: string) {
    return this.turnService.findAssignTurnsForSchedule(scheduleId);
  }

  @Get('fillTurns')
  fillTurns(@Query('idSchedule') idSchedule: number) {
    return this.turnService.fillTurns(idSchedule);
  }

  @Get('findNotAssignTurnsForSchedule')
  findNotAssignTurnsForSchedule(@Query('scheduleId') scheduleId: string) {
    return this.turnService.findNotAssignTurnsForSchedule(scheduleId);
  }

  @Patch('assignTurn')
  assignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.assignTurn(updateTurnDto);
  }

  @Patch('aproveTurn')
  aproveTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.aproveTurn(updateTurnDto);
  }

  @Patch('unAssignTurn')
  unAssignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.unAssignTurn(updateTurnDto);
  }

}
