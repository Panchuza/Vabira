import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, RoleProtected } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  @RoleProtected(ValidRoles.admin)
  @Auth()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/findOne')
  @RoleProtected(ValidRoles.user)
  @Auth()
  findOne(@Query('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('/findOneEmail')
  @Auth()
  findOneEmail(@Query('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Patch('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Patch('/delete')
  remove(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.remove(updateUserDto);
  }

}
