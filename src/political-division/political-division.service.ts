import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoliticalDivision } from 'src/entities/politicalDivision.entity';
import { Repository } from 'typeorm';
import { CreatePoliticalDivisionDto } from './dto/create-political-division.dto';
import { UpdatePoliticalDivisionDto } from './dto/update-political-division.dto';
import { sortAlpha } from '../common/helper/sortAlphabetically';

@Injectable()
export class PoliticalDivisionService {
  constructor(
    @InjectRepository(PoliticalDivision)
    private politicalDivisionRepository: Repository<PoliticalDivision>,
    ) 
    {}
  create(createPoliticalDivisionDto: CreatePoliticalDivisionDto) {
    return 'This action adds a new politicalDivision';
  }

  findAll() {
    return `This action returns all politicalDivision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} politicalDivision`;
  }

  update(id: number, updatePoliticalDivisionDto: UpdatePoliticalDivisionDto) {
    return `This action updates a #${id} politicalDivision`;
  }

  remove(id: number) {
    return `This action removes a #${id} politicalDivision`;
  }

  async politicalDivisionAll(id: number) {
    const qb = this.politicalDivisionRepository.createQueryBuilder('PoliticalDivision')
    qb
      .select('PoliticalDivision.id')
      .addSelect('PoliticalDivision.name')
      .addSelect('PoliticalDivision.initials')
      .addSelect('PoliticalDivision.active')
      .addSelect('Country.id')
      .leftJoin('PoliticalDivision.country', 'Country')
    if (id) qb.where('Country.id = :id', { id: id })
    const politicalDivision = await qb.getMany()
    sortAlpha(politicalDivision);
    return politicalDivision;
  }
}
