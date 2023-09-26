import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { sortAlpha } from '../common/helper/sortAlphabetically';

@Injectable()
export class RegionService {

  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    ) 
    {}

  create(createRegionDto: CreateRegionDto) {
    return 'This action adds a new region';
  }

  async regionAll(id: number) {
    const qb = this.regionRepository.createQueryBuilder('Region')
    qb
      .select('Region.id')
      .addSelect('Region.name')
      .addSelect('Region.initials')
      .addSelect('Region.active')
      .addSelect('Continent.id')
      .leftJoin('Region.continent', 'Continent')
    if (id) qb.where('Continent.id = :id', { id: id })
    const region = await qb.getMany()
    sortAlpha(region);
    return region;
  }

  findOne(id: number) {
    return `This action returns a #${id} region`;
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return `This action updates a #${id} region`;
  }

  remove(id: number) {
    return `This action removes a #${id} region`;
  }

}


