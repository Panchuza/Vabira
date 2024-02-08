import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Supplier } from 'src/entities/supplier.entity';
import { ProfileUser } from 'src/entities/profileUser.entity';
import { Profiles } from 'src/entities/profile.entity';
import { AccessProfile } from 'src/entities/accessProfile.entity';
import { Access } from 'src/entities/access.entity';
import { TypeService } from 'src/type/type.service';
import { Type } from 'src/entities/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Supplier, ProfileUser, Profiles, AccessProfile, Access, Type])],
  controllers: [SupplierController],
  providers: [SupplierService, UsersService, JwtService, TypeService]
})
export class SupplierModule {}
