import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeService } from 'src/type/type.service';
import { Type } from 'src/entities/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User, Type])],
  controllers: [ClientController],
  providers: [ClientService, UsersService, JwtService, TypeService]
})
export class ClientModule {}
