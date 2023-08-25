import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { DbException } from 'src/exception/dbException';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Turn } from 'src/entities/turn.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TurnService {
  constructor(
    @InjectRepository(Turn)
    private turnRepository: Repository<Turn>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) { }
  async create(createTurnDto: CreateTurnDto) {

    let turnDto = new Turn;
    const {  dateFrom, dateTo, ...toCreate } = createTurnDto;

    let turnResult
        await this.entityManager.transaction(async (transaction) => {
          try {
            turnResult = await transaction.save(turnDto);
          } catch (error) {
            console.log(error);
            throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });



  }

  async validation(dateFrom, dateTo) {
    const turnFound = await this.turnRepository.findOne({
      where: [{ dateFrom: dateFrom }, { dateTo: dateTo }]
    });

    if (!turnFound) {
      return false;
    } else {
      return true;
    }
  }

  findAll() {
    return `This action returns all turn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turn`;
  }

  update(id: number, updateTurnDto: UpdateTurnDto) {
    return `This action updates a #${id} turn`;
  }

  remove(id: number) {
    return `This action removes a #${id} turn`;
  }
}
