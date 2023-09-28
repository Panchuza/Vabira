import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Supplier } from 'src/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService, UsersService, JwtService]
})
export class SupplierModule {}
