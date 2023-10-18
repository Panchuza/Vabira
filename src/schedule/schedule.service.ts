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

    const supplierFound = await this.supplierRepository.findOne({ where: { user: supplier?.id as any } });

    const savedSchedule = await this.entityManager.transaction(async transactionalEntityManager => {
      const schedule = new Schedule();
      schedule.name = createScheduleDto.name;
      schedule.hasSign = createScheduleDto.hasSign;
      schedule.turnDuration = createScheduleDto.turnDuration;
      schedule.initialTurnDateTime = startTime.toISOString()
      schedule.finalTurnDateTime = endTime.toISOString()
      schedule.supplier = supplierFound;
      const savedSchedule = await transactionalEntityManager.save(Schedule, schedule);

      for (let day of days) {
        if (day === 'Sunday') {
          day = 'Domingo'
        } else if (day === 'Monday') {
          day = 'Lunes'
        } else if (day === 'Tuesday') {
          day = 'Martes'
        } else if (day === 'Wednesday') {
          day = 'Miercoles'
        } else if (day === 'Thursday') {
          day = 'Jueves'
        } else if (day === 'Friday') {
          day = 'Viernes'
        } else {
          day = 'Sabado'
        }
        const classDayType = await this.entityManager.findOneOrFail(Type, { where: { name: day } });

        // Itera a través de las fechas seleccionadas en el calendario
        for (const selectedDate of dates) {
          console.log(dates);

          const selectedDateISO = dateFns.parseISO(selectedDate); // Parsea la fecha a un objeto Date
          let currentTime = dateFns.setHours(selectedDateISO, dateFns.getHours(startTime));
          currentTime = dateFns.setMinutes(currentTime, dateFns.getMinutes(startTime));

          while (dateFns.isBefore(currentTime, dateFns.setHours(selectedDateISO, dateFns.getHours(endTime)))) {
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
    return schedule;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
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
