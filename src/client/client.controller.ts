import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get('all')
  findAll() {
    return this.clientService.findAll();
  }

  // @Get(':id')
  // findOne(@Query('id') id: string) {
  //   return this.clientService.findOne(+id);
  // }

  @Get('/findOneUserId')
  findOne2(@Query('id') id: string) {
    return this.clientService.findOneUserId(+id);
  }

  
  @Get('findOne')
  findOne(@Query('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Get('findOneClientByEmail')
  findOneClientByEmail(@Query('email') email: string) {
    return this.clientService.findOneClientByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
