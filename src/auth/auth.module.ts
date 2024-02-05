import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
import { EmailService } from 'src/email/email.service';
import { Profiles } from 'src/entities/profile.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';
import { AccessProfile } from 'src/entities/accessProfile.entity';
import { Access } from 'src/entities/access.entity';
dotenv.config();


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, EmailService],
  imports: [
    ConfigModule,
  
    TypeOrmModule.forFeature([Profiles, ProfileUser, User, Access, AccessProfile]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '10h'
          }
        }
      }
    })
    // JwtModule.register({
    // secret: process.env.JWT_SECRET,
    // signOptions: {
    //   expiresIn:'2h'
    // }
    // })

  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule]
})

export class AuthModule { }
