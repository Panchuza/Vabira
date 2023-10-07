import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
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

  async

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

  async findAllForSchedule(idSchedule: number) {
    const turns = await this.turnRepository.createQueryBuilder('Turn')
    .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.schedule'])
    .leftJoin('Turn.schedule', 'Schedule')
    .where('Schedule.id = :id', {id: idSchedule})
    .getMany()
    return turns
  }

  async assignTurn(updateTurnDto: UpdateTurnDto) {
    const turn = await this.turnRepository.createQueryBuilder('Turn')
    .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.schedule', 'Turn.client'])
    .addSelect('client.id')
    .addSelect('schedule.id')
    .leftJoin('Turn.client', 'client')
    .leftJoin('Turn.schedule', 'schedule')
    .where('Turn.id = :id', {id: updateTurnDto.id})
    .getOne()
    if(!turn.client){
    try {
      let turnResult: any
      await this.entityManager.transaction(async (transaction) => {
        try {
          turn.client = updateTurnDto.client
          turnResult = await transaction.save(turn);
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
      return {
        status: HttpStatus.OK,
        data: turnResult,
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  throw new BadRequestException('El turno solicitado ya esta registrado')
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
