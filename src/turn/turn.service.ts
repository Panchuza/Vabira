import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { DbException } from 'src/exception/dbException';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Turn } from 'src/entities/turn.entity';
import { EntityManager, Repository } from 'typeorm';
import { TypeService } from 'src/type/type.service';
import { TurnStatus } from 'src/entities/turnStatus.entity';
import * as moment from 'moment';

@Injectable()
export class TurnService {
  constructor(
    @InjectRepository(Turn)
    private turnRepository: Repository<Turn>,
    @InjectRepository(TurnStatus)
    private turnStatusRepository: Repository<TurnStatus>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly typeService: TypeService
  ) { }
  async create(createTurnDto: CreateTurnDto) {

    let turnDto = new Turn;
    const { dateFrom, dateTo, ...toCreate } = createTurnDto;

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

  async findAll() {
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin('Turn.turnStatus', 'turnStatus')
      .leftJoin('turnStatus.turnStatusType', 'turnStatusType')
      .getMany()
    return turns
  }

  async findAllForSchedule(idSchedule: number) {
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin('Turn.turnStatus', 'turnStatus')
      .leftJoin('turnStatus.turnStatusType', 'turnStatusType')
      .where('Schedule.id = :id', { id: idSchedule })
      .getMany()
      const formattedTurns = turns.map(turn => ({
        ...turn,
        dateFrom: moment(turn.dateFrom).format('hh:mm A'),
        dateTo: moment(turn.dateTo).format('hh:mm A'),
        monthDay: moment(turn.dateFrom).format('DD/MM'),
      }));
  
      return formattedTurns;
  }

  async assignTurn(updateTurnDto: UpdateTurnDto) {
    const turn = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.schedule', 'Turn.client'])
      .addSelect('client.id')
      .addSelect('schedule.id')
      .leftJoin('Turn.client', 'client')
      .leftJoin('Turn.schedule', 'schedule')
      .where('Turn.id = :id', { id: updateTurnDto.id })
      .getOne()
    const newTurnStatus = new TurnStatus()
    newTurnStatus.statusRegistrationDateTime = this.formatDate(new Date)
    newTurnStatus.turnStatusType = await this.validateTypeTurnStatus2()
    newTurnStatus.turn = turn
    if (!turn.client) {
      try {
        let turnResult: any
        await this.entityManager.transaction(async (transaction) => {
          try {
            turn.client = updateTurnDto.client
            await this.turnStatusRepository.save(newTurnStatus);
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
  async findAssignTurns() {
    const status = await this.validateTypeTurnStatus2()
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .addSelect(['turnStatusType.id', 'turnStatusType.name'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin(
        (qb) =>
          qb
            .select('Turn.id', 'id')
            .addSelect('MAX(ss.Id)', 'smax')
            .from(Turn, 'Turn')
            .leftJoin('Turn.turnStatus', 'ss')
            .groupBy('Turn.id'),
        'sm',
        'sm.id = Turn.id',
      )
      .leftJoin(
        'Turn.turnStatus',
        'turnStatus',
        'turnStatus.id = sm.smax',
      )
      .leftJoin(
        'turnStatus.turnStatusType',
        'turnStatusType',
      )
      .where('turnStatusType.id = :status', { status: status.id })
      .getMany()

    if (turns.length === 0) {
      throw new BadRequestException('No existen turnos reservados');
    }
    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
    }));

    return formattedTurns;
  }
  async findNotAssignTurns() {
    const status = await this.validateTypeTurnStatus()
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .addSelect(['turnStatusType.id', 'turnStatusType.name'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin(
        (qb) =>
          qb
            .select('Turn.id', 'id')
            .addSelect('MAX(ss.Id)', 'smax')
            .from(Turn, 'Turn')
            .leftJoin('Turn.turnStatus', 'ss')
            .groupBy('Turn.id'),
        'sm',
        'sm.id = Turn.id',
      )
      .leftJoin(
        'Turn.turnStatus',
        'turnStatus',
        'turnStatus.id = sm.smax',
      )
      .leftJoin(
        'turnStatus.turnStatusType',
        'turnStatusType',
      )
      .where('turnStatusType.id = :status', { status: status.id })
      .getMany()


    if (turns.length === 0) {
      throw new BadRequestException('No existen turnos disponibles');
    }

    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
    }));

    return formattedTurns;
  }
  async findAssignTurnsForSchedule(scheduleId: string) {
    const status = await this.validateTypeTurnStatus2()
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .addSelect(['turnStatusType.id', 'turnStatusType.name'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin(
        (qb) =>
          qb
            .select('Turn.id', 'id')
            .addSelect('MAX(ss.Id)', 'smax')
            .from(Turn, 'Turn')
            .leftJoin('Turn.turnStatus', 'ss')
            .groupBy('Turn.id'),
        'sm',
        'sm.id = Turn.id',
      )
      .leftJoin(
        'Turn.turnStatus',
        'turnStatus',
        'turnStatus.id = sm.smax',
      )
      .leftJoin(
        'turnStatus.turnStatusType',
        'turnStatusType',
      )
      .where('turnStatusType.id = :status', { status: status.id })
      .andWhere('Turn.schedule = :scheduleId', {scheduleId: scheduleId})
      .getMany()

    if (turns.length === 0) {
      throw new BadRequestException('No existen turnos reservados');
    }
    
    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
    }));

    return formattedTurns;
  }
  async findNotAssignTurnsForSchedule(scheduleId: string) {
    const status = await this.validateTypeTurnStatus()
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .addSelect(['turnStatusType.id', 'turnStatusType.name'])
      .leftJoin('Turn.client', 'client')
      .leftJoin('client.user', 'user')
      .leftJoin('Turn.classDayType', 'type')
      .leftJoin('Turn.schedule', 'schedule')
      .leftJoin(
        (qb) =>
          qb
            .select('Turn.id', 'id')
            .addSelect('MAX(ss.Id)', 'smax')
            .from(Turn, 'Turn')
            .leftJoin('Turn.turnStatus', 'ss')
            .groupBy('Turn.id'),
        'sm',
        'sm.id = Turn.id',
      )
      .leftJoin(
        'Turn.turnStatus',
        'turnStatus',
        'turnStatus.id = sm.smax',
      )
      .leftJoin(
        'turnStatus.turnStatusType',
        'turnStatusType',
      )
      .where('turnStatusType.id = :status', { status: status.id })
      .andWhere('Turn.schedule = :scheduleId', {scheduleId: scheduleId})
      .getMany()


    if (turns.length === 0) {
      throw new BadRequestException('No existen turnos disponibles');
    }

    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
    }));

    return formattedTurns;
  }
  async validateTypeTurnStatus() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('TurnoDisponible')
    return turnTypeStatus
  }
  async validateTypeTurnStatus2() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('TurnoReservado')
    return turnTypeStatus
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

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  private formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
}
