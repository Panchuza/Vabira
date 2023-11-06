import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/entities/user.entity';
import { Profiles } from 'src/entities/profile.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Profiles, ProfileUser])],
  controllers: [ProductController],
  providers: [ProductService, AuthService, UsersService, JwtService, EmailService]
})
export class ProductModule {}
