import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Profiles } from 'src/entities/profile.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// users.module.ts
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Profiles, ProfileUser]),
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService], 
})
export class UsersModule {}


