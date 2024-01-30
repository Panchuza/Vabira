import { Injectable, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { DbException } from 'src/exception/dbException';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Turn } from 'src/entities/turn.entity';
import { EntityManager, Repository } from 'typeorm';
import { TypeService } from 'src/type/type.service';
import { TurnStatus } from 'src/entities/turnStatus.entity';
import * as moment from 'moment';
import { Client } from 'src/entities/client.entity';
import { SignStatus } from 'src/entities/signStatus.entity';

@Injectable()
export class TurnService {
  constructor(
    @InjectRepository(Turn)
    private turnRepository: Repository<Turn>,
    @InjectRepository(TurnStatus)
    private turnStatusRepository: Repository<TurnStatus>,
    @InjectRepository(SignStatus)
    private signStatusRepository: Repository<SignStatus>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly typeService: TypeService
  ) { }

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
      .where('Schedule.id = :id', { id: idSchedule })
      .getMany()
    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS'),
      dateTo: moment(turn.dateTo).format('YYYY-MM-DDTHH:mm:ss.SSS'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
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
      .andWhere('Turn.schedule = :scheduleId', { scheduleId: scheduleId })
      .getMany()

    // if (turns.length === 0) {
    //   throw new BadRequestException('No existen turnos reservados');
    // }

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
      .andWhere('Turn.schedule = :scheduleId', { scheduleId: scheduleId })
      .getMany()


    // if (turns.length === 0) {
    //   throw new BadRequestException('No existen turnos disponibles');
    // }

    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
    }));

    return formattedTurns;
  }
  async findAproveTurnsForSchedule(scheduleId: string) {
    const status = await this.validateTypeTurnStatus3()
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
      .andWhere('Turn.schedule = :scheduleId', { scheduleId: scheduleId })
      .getMany()


    // if (turns.length === 0) {
    //   throw new BadRequestException('No existen turnos disponibles');
    // }

    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
    }));

    return formattedTurns;
  }

  async findDesaproveTurnsForSchedule(scheduleId: string) {
    const status = await this.validateTypeTurnStatus4()
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
      .andWhere('Turn.schedule = :scheduleId', { scheduleId: scheduleId })
      .getMany()


    // if (turns.length === 0) {
    //   throw new BadRequestException('No existen turnos disponibles');
    // }

    const formattedTurns = turns.map(turn => ({
      ...turn,
      dateFrom: moment(turn.dateFrom).format('hh:mm A'),
      dateTo: moment(turn.dateTo).format('hh:mm A'),
      monthDay: moment(turn.dateFrom).format('DD/MM'),
    }));

    return formattedTurns;
  }
  async findAproveWithSignTurnsForSchedule(scheduleId: string) {
    const statusTurn = await this.validateTypeTurnStatus2()
    const statusSign = await this.validateTypeSignStatus()
    const turns = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.classDayType', 'Turn.schedule', 'Turn.client'])
      .addSelect(['client.id', 'user.id', 'user.username', 'user.firstName', 'user.lastName'])
      .addSelect('schedule.id')
      .addSelect(['type.id', 'type.name'])
      .addSelect(['turnStatus.id', 'turnStatus.turnStatusType'])
      .addSelect(['turnStatusType.id', 'turnStatusType.name'])
      .leftJoin('Turn.client', 'client')
      .leftJoinAndSelect('Turn.sign', 'sign')
      .leftJoinAndSelect('sign.signStatus', 'signStatus')
      .leftJoinAndSelect('signStatus.signStatusType', 'signStatusType')
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
      // .where('turnStatusType.id = :status', { status: statusTurn.id })
      .where('signStatusType.id = :statusSign', { statusSign: statusSign.id })
      .andWhere('Turn.schedule = :scheduleId', { scheduleId: scheduleId })
      .getMany()


    // if (turns.length === 0) {
    //   throw new BadRequestException('No existen turnos disponibles');
    // }

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

  async validateTypeTurnStatus3() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('TurnoPresente')
    return turnTypeStatus
  }

  async validateTypeTurnStatus4() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('TurnoAusente')
    return turnTypeStatus
  }

  async validateTypeSignStatus() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('SeñaEsperandoAprobacion')
    return turnTypeStatus
  }

  async assignTurn(updateTurnDto: UpdateTurnDto) {
    const turn = await this.turnRepository.createQueryBuilder('Turn')
      .select(['Turn.id', 'Turn.dateTo', 'Turn.dateFrom', 'Turn.schedule', 'Turn.client'])
      .leftJoinAndSelect('Turn.client', 'client')
      .leftJoinAndSelect('Turn.schedule', 'schedule')
      .leftJoinAndSelect('Turn.sign', 'sign')
      .leftJoinAndSelect('sign.signStatus', 'signStatus')
      .leftJoinAndSelect('signStatus.signStatusType', 'signStatusType')
      .where('Turn.id = :id', { id: updateTurnDto.id })
      .getOne();

    if (!turn) {
      throw new NotFoundException('Turno no encontrado');
    }

    // Verifica si el turno tiene una seña asignada y si la seña está pagada
    const isSignAssigned = turn.schedule.hasSign;
    if (isSignAssigned === true) {
      const isSignPaid = isSignAssigned && turn.sign.signStatus.some(status => status.signStatusType.code === 'SeñaPagada');
      if (isSignAssigned && !isSignPaid) {
        // Si la seña está asignada pero no está pagada, no permite asignar el turno
        throw new BadRequestException('No se puede asignar el turno hasta que la seña esté pagada');
      }
      updateTurnDto.signPay === turn.sign.initialAmount
    }


    const newTurnStatus = new TurnStatus();
    newTurnStatus.statusRegistrationDateTime = this.formatDate(new Date());
    newTurnStatus.turnStatusType = await this.validateTypeTurnStatus2();
    newTurnStatus.turn = turn;

    try {
      let turnResult: any;
      // let alertResult: any;

      await this.entityManager.transaction(async (transaction) => {
        try {
          turn.client = updateTurnDto.client;
          await this.turnStatusRepository.save(newTurnStatus);
          turnResult = await transaction.save(turn);
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });

      return {
        status: HttpStatus.OK,
        data: {turn: turnResult}
      };
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async aproveTurn(updateTurnDto: UpdateTurnDto) {
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
    newTurnStatus.turnStatusType = await this.validateTypeTurnStatus3()
    newTurnStatus.turn = turn

    if (turn.client) {
      try {
        let turnResult: any
        await this.entityManager.transaction(async (transaction) => {
          try {
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
    throw new BadRequestException('El turno solicitado ya esta aprobado')
  }

  async desaproveTurn(updateTurnDto: UpdateTurnDto) {
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
    newTurnStatus.turnStatusType = await this.validateTypeTurnStatus4()
    newTurnStatus.turn = turn

    if (turn.client) {
      try {
        let turnResult: any
        await this.entityManager.transaction(async (transaction) => {
          try {
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
    throw new BadRequestException('El turno solicitado ya esta desaprobado')
  }

  async unAssignTurn(updateTurnDto: UpdateTurnDto) {
    const client = await this.clientRepository.findOne({ where: { id: updateTurnDto.client.id } })
    const turnAssignedSelect = await this.turnRepository.findOne({ where: { client: client as any, id: updateTurnDto.id } })

    if (turnAssignedSelect) {
      const newTurnStatus = new TurnStatus()
      newTurnStatus.statusRegistrationDateTime = this.formatDate(new Date)
      newTurnStatus.turnStatusType = await this.validateTypeTurnStatus()
      newTurnStatus.turn = turnAssignedSelect
      try {
        let turnResult: any
        await this.entityManager.transaction(async (transaction) => {
          try {
            turnAssignedSelect.client = null;
            await this.turnStatusRepository.save(newTurnStatus);
            turnResult = await transaction.save(turnAssignedSelect);
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
    } else {
      throw new BadRequestException('El turno no corresponde al cliente logueado')
    }
  }

  async turnForPay(idTurn: any){
    const turnFound = await this.turnRepository.createQueryBuilder('turn')
    .select('turn.id')
    .leftJoinAndSelect('turn.sign', 'sign')
    .leftJoinAndSelect('sign.signStatus', 'signStatus')
    .leftJoinAndSelect('signStatus.signStatusType', 'signStatusType')
    .leftJoinAndSelect('turn.turnStatus', 'turnStatus')
    .leftJoinAndSelect('turnStatus.turnStatusType', 'turnStatusType')
    .leftJoinAndSelect('turn.client', 'client')
    .where('turn.id = :id', {id: idTurn.idTurno})
    .getOne()
    const statusBase = await this.validateTypeTurnStatus()
    if(turnFound.turnStatus[0].turnStatusType.code != statusBase.code || turnFound.client){
      throw new BadRequestException('El turno debe de estar disponible')
    }
    const clientFound = await this.clientRepository.findOne({where: {id: idTurn.idCliente}})
    turnFound.client = clientFound
    const newSignStatus = new SignStatus()
    newSignStatus.statusRegistrationDateTime = this.formatDate(new Date)
    newSignStatus.signStatusType = await this.validateTypeSignStatus()
    newSignStatus.sign = turnFound.sign
    const newTurnStatus = new TurnStatus()
    newTurnStatus.statusRegistrationDateTime = this.formatDate(new Date)
    newTurnStatus.turnStatusType = await this.validateTypeSignStatus()
    newTurnStatus.turn = turnFound
    await this.signStatusRepository.save(newSignStatus);
    await this.turnRepository.save(turnFound)
    await this.turnStatusRepository.save(newTurnStatus);
  }

  async fillTurns(idSchedule: number) {
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
      .where('Schedule.id = :id', { id: idSchedule })
      .getMany();

    // Filtrar los turnos reservados, aprobados y desaprobados
    const reservedTurns = turns.filter((turn) => turn.turnStatus[0].turnStatusType.name === 'Reservado').length;
    const aproveTurns = turns.filter((turn) => turn.turnStatus[0].turnStatusType.name === 'Presente').length;
    const desaproveTurns = turns.filter((turn) => turn.turnStatus[0].turnStatusType.name === 'Ausente').length;

    // Calcular la cantidad de turnos en total
    const totalTurns = turns.length;

    // Calcular la cantidad de turnos cuyo último estado es "TurnoReservado"
    const availableTurns = totalTurns - reservedTurns - aproveTurns - desaproveTurns;

    return {
      totalTurns,
      reservedTurns,
      availableTurns,
      reservedTurns2: turns.filter((turn) => turn.turnStatus[0].turnStatusType.name === 'Reservado'),
      aproveTurns,
      desaproveTurns
    };
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
