import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';
import { Turn } from 'src/entities/turn.entity';
import * as dateFns from 'date-fns';
import { Type } from 'src/entities/type.entity';
import { TurnService } from 'src/turn/turn.service';
import { DbException } from 'src/exception/dbException';
import { Supplier } from 'src/entities/supplier.entity';
import { TypeService } from 'src/type/type.service';
import { TurnStatus } from 'src/entities/turnStatus.entity';
import { es } from 'date-fns/locale';
import * as moment from 'moment';


@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly typeService: TypeService,

  ) { }


async createSchedule(createScheduleDto: CreateScheduleDto) {
  const { days, turnDuration, supplier, dates } = createScheduleDto;

  // Obtén la fecha de inicio y fin para los turnos
  const startTime = dateFns.parse(createScheduleDto.initialTurnDateTime, 'HH:mm', new Date());
  const endTime = dateFns.parse(createScheduleDto.finalTurnDateTime, 'HH:mm', new Date());

  // Verifica si la duración del turno es menor o igual al tiempo disponible
  const timeDiff = dateFns.differenceInMinutes(endTime, startTime);
  if (turnDuration > timeDiff) {
    throw new Error('La duración del turno excede el tiempo disponible.');
  }

  const supplierFound = await this.supplierRepository.findOne({ where: { user: supplier?.id as any } });

  const savedSchedule = await this.entityManager.transaction(async transactionalEntityManager => {
    const schedule = new Schedule();
    schedule.name = createScheduleDto.name;
    schedule.hasSign = createScheduleDto.hasSign;
    schedule.turnDuration = createScheduleDto.turnDuration;
    schedule.initialTurnDateTime = startTime.toISOString();
    schedule.finalTurnDateTime = endTime.toISOString();
    schedule.supplier = supplierFound;
    const savedSchedule = await transactionalEntityManager.save(Schedule, schedule);

    for (const selectedDate of dates) {
      const selectedDayOfWeek = dateFns.format(new Date(selectedDate), 'EEEE', { locale: es });
      let capitalizedSelectedDayOfWeek = selectedDayOfWeek.charAt(0).toUpperCase() + selectedDayOfWeek.slice(1);
      if (capitalizedSelectedDayOfWeek === "Miércoles") {
        capitalizedSelectedDayOfWeek = "Miercoles";
      }
      if (capitalizedSelectedDayOfWeek === "Sábado") {
        capitalizedSelectedDayOfWeek = "Sabado";
      }
      const modifiedDays = days.map(day => {
        if (day === 'Sunday') {
          return 'Domingo';
        } else if (day === 'Monday') {
          return 'Lunes';
        } else if (day === 'Tuesday') {
          return 'Martes';
        } else if (day === 'Wednesday') {
          return 'Miercoles';
        } else if (day === 'Thursday') {
          return 'Jueves';
        } else if (day === 'Friday') {
          return 'Viernes';
        } else if (day === 'Saturday'){
          return 'Sabado';
        }
      });

      if (modifiedDays.includes(capitalizedSelectedDayOfWeek as any)) {
        const classDayType = await this.entityManager.findOneOrFail(Type, { where: { name: capitalizedSelectedDayOfWeek } });

        let currentTime = dateFns.setHours(new Date(selectedDate), dateFns.getHours(startTime));
        currentTime = dateFns.setMinutes(currentTime, dateFns.getMinutes(startTime));

        while (dateFns.isBefore(currentTime, dateFns.setHours(new Date(selectedDate), dateFns.getHours(endTime))) || dateFns.isSameMinute(currentTime, dateFns.setHours(new Date(selectedDate), dateFns.getHours(endTime)))) {
          const newTurn = new Turn();
          const newTurnStatus = new TurnStatus();
          newTurnStatus.statusRegistrationDateTime = this.formatDate(new Date());
          newTurnStatus.turnStatusType = await this.validateTypeTurnStatus();
          newTurn.dateFrom = currentTime as any;
          newTurn.dateTo = dateFns.addMinutes(currentTime, turnDuration) as any;
          newTurn.classDayType = classDayType;
          newTurn.schedule = savedSchedule;
          newTurn.turnStatus = [newTurnStatus];

          await transactionalEntityManager.save(TurnStatus, newTurnStatus);
          await transactionalEntityManager.save(Turn, newTurn);

          currentTime = dateFns.addMinutes(currentTime, turnDuration);
        }
      }
    }

    return savedSchedule;
  });

  return savedSchedule;
}

  async validateTypeTurnStatus() {
    const turnTypeStatus = await this.typeService.findTypeByCodeJust('TurnoDisponible')
    return turnTypeStatus
  }

  async findAll() {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name'])
      .addSelect(['Turn.id', 'Turn.dateFrom', 'Turn.dateTo', 'Turn.classDayType'])
      .addSelect(['Type.id', 'Type.name'])
      .addSelect(['Supplier.id', 'User.firstName', 'User.lastName'])
      .leftJoin('Schedule.turn', 'Turn')
      .leftJoin('Turn.classDayType', 'Type')
      .leftJoin('Schedule.supplier', 'Supplier')
      .leftJoin('Supplier.user', 'User')
      .getMany()
    return schedule;
  }

  async findAllForSupplier() {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name'])
      .addSelect(['Supplier.id', 'User.username', 'User.firstName', 'User.lastName'])
      .leftJoin('Schedule.supplier', 'Supplier')
      .leftJoin('Supplier.user', 'User')
      .getMany()
    return schedule;
  }

  async findOne(id: number) {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name'])
      .addSelect(['Turn.id', 'Turn.dateFrom', 'Turn.dateTo', 'Turn.classDayType'])
      .addSelect(['Type.id', 'Type.name'])
      .leftJoin('Schedule.turn', 'Turn')
      .leftJoin('Turn.classDayType', 'Type')
      .leftJoin('Schedule.supplier', 'Supplier')
      .where('Schedule.id = :id', { id: id })
      // .andWhere('Supplier.id = :idSupplier', {idSupplier: idSupplier})
      .getOne()
    if (schedule) {
      schedule.turn = schedule.turn.map(turn => ({
        ...turn,
        dateFrom: moment(turn.dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        dateTo: moment(turn.dateTo).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        monthDay: moment(turn.dateFrom).format('DD/MM'),
      }));
    }
    return schedule;
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
