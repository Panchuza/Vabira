import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from 'src/entities/type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sortAlpha } from 'src/common/helper/sortAlphabetically';

@Injectable()
export class TypeService {

  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>
  ){}


  create(createTypeDto: CreateTypeDto) {
    return 'This action adds a new type';
  }

  async findTypeByCode(code: string): Promise<Type[]> {
    console.log(code)
    const type = await this.typeRepository.createQueryBuilder('type')
      .innerJoin('type.typeConfig', 'typeConfig')
      .where("typeConfig.code = :code", { code: code })
      .orderBy("type.order", "ASC")
      .getMany();

    if (typeof type[1] !== 'undefined' && type[1] !== null && +type[1].order === 0) {
        sortAlpha(type);
    }
    console.log(type);

    return type;
  }

  findTypeByCodeJust(code: string ){
    console.log(code)
       const type = this.typeRepository.createQueryBuilder('type').where("type.code = :code", {code: code}).getOne()
    return type;
  }
  async findTypeByidJust(id: number ): Promise<Type> {
    console.log(id)
       const type = await this.typeRepository.createQueryBuilder('type').where("type.id = :id", {id: id}).getOne()
    return type;
  }

  async GetTypeByCodeDto(id: number) {
    let type: Type = await this.typeRepository.findOne({ where: { id: id } })
    return type
  }

  findAll() {
    return `This action returns all type`;
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
