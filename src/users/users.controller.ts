import { Controller, Get, Post, Body, Patch, Query, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/findOne')
  @UseGuards(AuthGuard)
  findOne(@Query('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/update')
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch('/delete')
  remove(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.remove(updateUserDto);
  }
}
