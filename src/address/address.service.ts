import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { TypeService } from 'src/type/type.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private typeService: TypeService
    ){}
  async create(createAddressDto: CreateAddressDto, typeAdressId: number, entityManager?: EntityManager){
    console.log("entre al address")
    let address = plainToClass(Address,createAddressDto)
    let typeAdress = await this.typeService.GetTypeByCodeDto(typeAdressId)
    address.addressType = typeAdress
    try{
      
      await this.addressRepository.save(address)

    }catch(error){
      console.log(error);
    };

    return address
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
