import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { Type } from 'src/entities/type.entity';
import { Country } from 'src/entities/country.entity';
import { Region } from 'src/entities/region.entity';
import { Continent } from 'src/entities/continent.entity';
import { PoliticalDivision } from 'src/entities/politicalDivision.entity';
import { TypeService } from 'src/type/type.service';

@Module({
  imports:[TypeOrmModule.forFeature([Address, Type, Country, Region,Continent, PoliticalDivision ])],
  controllers: [AddressController],
  providers: [AddressService, TypeService]
})
export class AddressModule {}
