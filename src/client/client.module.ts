import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  controllers: [ClientController],
  providers: [ClientService, UsersService, JwtService]
})
export class ClientModule {}
