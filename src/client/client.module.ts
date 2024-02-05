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
import { Profiles } from 'src/entities/profile.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';
import { AccessProfile } from 'src/entities/accessProfile.entity';
import { Access } from 'src/entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User, Type, Profiles, ProfileUser, AccessProfile, Access])],
  controllers: [ClientController],
  providers: [ClientService, UsersService, JwtService, TypeService]
})
export class ClientModule {}
