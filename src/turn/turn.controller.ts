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

  @Get('findDesaproveTurnsForSchedule')
  findDesaproveTurnsForSchedule(@Query('scheduleId') scheduleId: string) {
    return this.turnService.findDesaproveTurnsForSchedule(scheduleId);
  }

  @Get('findAproveTurnsForSchedule')
  findAproveTurnsForSchedule(@Query('scheduleId') scheduleId: string) {
    return this.turnService.findAproveTurnsForSchedule(scheduleId);
  }

  @Get('findAproveWithSignTurnsForSchedule')
  findAproveWithSignTurnsForSchedule(@Query('scheduleId') scheduleId: string) {
    return this.turnService.findAproveWithSignTurnsForSchedule(scheduleId);
  }

  @Patch('assignTurn')
  assignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.assignTurn(updateTurnDto);
  }

  @Patch('turnForPay')
  turnForPay(@Body() idTurno: number) {
    return this.turnService.turnForPay(idTurno);
  }

  @Patch('aproveTurn')
  aproveTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.aproveTurn(updateTurnDto);
  }

  @Patch('aproveSignTurn')
  aproveSignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.aproveSignTurn(updateTurnDto);
  }

  @Patch('desaproveSignTurn')
  desaproveSignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.desaproveSignTurn(updateTurnDto);
  }

  @Patch('desaproveTurn')
  desaproveTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.desaproveTurn(updateTurnDto);
  }

  @Patch('unAssignTurn')
  unAssignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.unAssignTurn(updateTurnDto);
  }

}
