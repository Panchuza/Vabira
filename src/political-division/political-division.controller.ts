import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PoliticalDivisionService } from './political-division.service';
import { CreatePoliticalDivisionDto } from './dto/create-political-division.dto';
import { UpdatePoliticalDivisionDto } from './dto/update-political-division.dto';

@Controller('politicalDivision')
export class PoliticalDivisionController {
  constructor(private readonly politicalDivisionService: PoliticalDivisionService) {}

  @Post()
  create(@Body() createPoliticalDivisionDto: CreatePoliticalDivisionDto) {
    return this.politicalDivisionService.create(createPoliticalDivisionDto);
  }

  @Get('all')
  findAll(@Query('id') id: number) {
    return this.politicalDivisionService.politicalDivisionAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.politicalDivisionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoliticalDivisionDto: UpdatePoliticalDivisionDto) {
    return this.politicalDivisionService.update(+id, updatePoliticalDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.politicalDivisionService.remove(+id);
  }
}
