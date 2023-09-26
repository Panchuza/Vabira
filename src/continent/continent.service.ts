import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Continent } from 'src/entities/continent.entity';
import { Country } from 'src/entities/country.entity';
import { Repository } from 'typeorm';
import { CreateContinentDto } from './dto/create-continent.dto';
import { UpdateContinentDto } from './dto/update-continent.dto';
import { sortAlpha } from '../common/helper/sortAlphabetically';

@Injectable()
export class ContinentService {

  constructor(
    @InjectRepository(Continent)
    private continentRepository: Repository<Continent>,
    ) 
    {}

  create(createContinentDto: CreateContinentDto) {
    return 'This action adds a new continent';
  }

  async continentAll() {
    const c = await this.continentRepository.find({
      where: {
        active: true
      }
    });
    sortAlpha(c);
    return c;
  }

  async findOne(id: number) {
    let continent = await this.continentRepository.findOne({where:{id:id}})
    return continent ;
  }

  update(id: number, updateContinentDto: UpdateContinentDto) {
    return `This action updates a #${id} continent`;
  }

  remove(id: number) {
    return `This action removes a #${id} continent`;
  }
}
