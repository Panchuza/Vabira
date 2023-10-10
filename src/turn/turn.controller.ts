import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TurnService } from './turn.service';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';

@Controller('turn')
export class TurnController {
  constructor(private readonly turnService: TurnService) {}

  @Post()
  create(@Body() createTurnDto: CreateTurnDto) {
    return this.turnService.create(createTurnDto);
  }

  @Get('findAllForSchedule')
  findAll(@Query('idSchedule') idSchedule: string   ) {
    return this.turnService.findAllForSchedule(+idSchedule);
  }

  @Get('findAll')
  findAllTurns() {
    return this.turnService.findAll();
  }

  @Get('findAssignTurns')
  findAssignTurns() {
    return this.turnService.findAssignTurns();
  }

  @Get('findNotAssignTurns')
  findNotAssignTurns() {
    return this.turnService.findNotAssignTurns();
  }

  @Patch('assignTurn')
  assignTurn(@Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.assignTurn(updateTurnDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnDto: UpdateTurnDto) {
    return this.turnService.update(+id, updateTurnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnService.remove(+id);
  }
}
