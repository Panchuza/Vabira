import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { Country } from 'src/entities/country.entity';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { sortAlpha } from '../common/helper/sortAlphabetically';

@Injectable()
export class CountryService {

  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    ) 
    {}
  create(createCountryDto: CreateCountryDto) {
    return 'This action adds a new country';
  }

  findAll() {
    return `This action returns all country`;
  }

  async GetCountryList() {
  
    const countryList = await this.countryRepository.find()

    sortAlpha(countryList);
  
    return countryList;
  
  }

  async countryAll(id: number) {
    const qb = this.countryRepository.createQueryBuilder('Country')
    qb
      .select('Country.id')
      .addSelect('Country.name')
      .addSelect('Country.active')
      .addSelect('Region.id')
      .leftJoin('Country.region', 'Region')
    if (id) qb.where('Region.id = :id', { id: id })
    const country = await qb.getMany()
    sortAlpha(country);
    return country;
  }
  findByName(name: string)  {
    return this.countryRepository.findBy({name: name})
  }

  findOneByName(name: string)  {
    return this.countryRepository.findOneBy({name: name})
  }

  findOne(id: number) {
    return this.countryRepository.findBy({id: id})
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }

}
