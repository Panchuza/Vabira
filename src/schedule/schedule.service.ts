import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
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
import { User } from 'src/entities/user.entity';
import { Alert } from 'src/entities/alert.entity';
import { Sign } from 'src/entities/sign.entity';
import { SignStatus } from 'src/entities/signStatus.entity';
import { GoogleCalendarService } from 'src/schedule/google-calendar.service';

@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly typeService: TypeService,
    private readonly googleCalendarService: GoogleCalendarService,

  ) { }


  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const { days, turnDuration, supplier, dates, alias } = createScheduleDto;

    // Obtén la fecha de inicio y fin para los turnos
    const startTime = dateFns.parse(createScheduleDto.initialTurnDateTime, 'HH:mm', new Date());
    const endTime = dateFns.parse(createScheduleDto.finalTurnDateTime, 'HH:mm', new Date());

    // Verifica si la duración del turno es menor o igual al tiempo disponible
    const timeDiff = dateFns.differenceInMinutes(endTime, startTime);
    if (turnDuration > timeDiff) {
      throw new Error('La duración del turno excede el tiempo disponible.');
    }
    const userFound = await this.userRepository.findOne({ where: { id: supplier.id } })
    const supplierFound = await this.supplierRepository.findOne({ where: { user: userFound as any }, relations: { user: true } });

    const savedSchedule = await this.entityManager.transaction(async transactionalEntityManager => {
      const schedule = new Schedule();
      schedule.name = createScheduleDto.name;
      schedule.hasSign = createScheduleDto.hasSign;
      schedule.turnDuration = createScheduleDto.turnDuration;
      schedule.initialTurnDateTime = startTime.toISOString();
      schedule.finalTurnDateTime = endTime.toISOString();
      schedule.supplier = supplierFound;
      if(alias){
        schedule.alias = alias;
      }
      schedule.active = true;
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
          } else if (day === 'Saturday') {
            return 'Sabado';
          }
        });

        if (modifiedDays.includes(capitalizedSelectedDayOfWeek as any)) {
          const classDayType = await this.entityManager.findOneOrFail(Type, { where: { name: capitalizedSelectedDayOfWeek } });

          let currentTime = dateFns.setHours(new Date(selectedDate), dateFns.getHours(startTime));
          currentTime = dateFns.setMinutes(currentTime, dateFns.getMinutes(startTime));

          if (turnDuration >= 60) {

            while (dateFns.isBefore(currentTime, dateFns.setHours(new Date(selectedDate), dateFns.getHours(endTime)))) {
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
              const newAlert = new Alert();
              newAlert.description = `Nueva alerta para agenda de: ${supplierFound.user.firstName}`
              newAlert.name = `Alerta para agenda de: ${supplierFound.user.firstName}`
              newAlert.turn = newTurn;
              await transactionalEntityManager.save(Alert, newAlert);
              const newSign = new Sign();
              const newSignStatus = new SignStatus();
              newSignStatus.statusRegistrationDateTime = this.formatDate(new Date());
              newSignStatus.signStatusType = await this.validateSignTurnStatus();
              newSign.signStatus = [newSignStatus];
              newSign.createDateTime = this.formatDate(new Date());
              newSign.initialAmount = createScheduleDto.sign
              newSign.turn = newTurn;
              await transactionalEntityManager.save(SignStatus, newSignStatus)
              await transactionalEntityManager.save(Sign, newSign)
              currentTime = dateFns.add(currentTime, { minutes: turnDuration });
            }
          } else {

            const endTimeLimit = dateFns.setHours(
              dateFns.setMinutes(new Date(selectedDate), dateFns.getMinutes(endTime)),
              dateFns.getHours(endTime)
            );

            while (currentTime < endTimeLimit) {
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
              const newAlert = new Alert();
              newAlert.description = `Nueva alerta para agenda de: ${supplierFound.user.firstName}`
              newAlert.name = `Alerta para agenda de: ${supplierFound.user.firstName}`
              newAlert.turn = newTurn
              await transactionalEntityManager.save(Alert, newAlert)
              const newSign = new Sign();
              const newSignStatus = new SignStatus();
              newSignStatus.statusRegistrationDateTime = this.formatDate(new Date());
              newSignStatus.signStatusType = await this.validateSignTurnStatus();
              newSign.signStatus = [newSignStatus];
              newSign.createDateTime = this.formatDate(new Date());
              newSign.initialAmount = createScheduleDto.sign
              newSign.turn = newTurn;
              await transactionalEntityManager.save(SignStatus, newSignStatus)
              await transactionalEntityManager.save(Sign, newSign)
              currentTime = dateFns.add(currentTime, { minutes: turnDuration });
            }

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

  async validateSignTurnStatus(){
    const signTypeStatus = await this.typeService.findTypeByCodeJust('SeñaAPagar')
    return signTypeStatus
  }

  async validateSignTurnStatus2(){
    const signTypeStatus = await this.typeService.findTypeByCodeJust('SeñaPagada')
    return signTypeStatus
  }

  async findAll() {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name'])
      .addSelect(['Turn.id', 'Turn.dateFrom', 'Turn.dateTo', 'Turn.classDayType'])
      .addSelect(['Type.id', 'Type.name'])
      .addSelect(['Supplier.id', 'User.firstName', 'User.lastName', 'User.username'])
      .leftJoin('Schedule.turn', 'Turn')
      .leftJoin('Turn.classDayType', 'Type')
      .leftJoin('Schedule.supplier', 'Supplier')
      .leftJoin('Supplier.user', 'User')
      .getMany()
    return schedule;
  }

  async findAllForSupplier(id: number, userType: string) {
    const schedule = this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name', 'Schedule.hasSign'])
      .addSelect(['Supplier.id', 'User.username', 'User.firstName', 'User.lastName'])
      .leftJoin('Schedule.supplier', 'Supplier')
      .leftJoin('Supplier.user', 'User')
      .where('Schedule.active = 1')
      if(userType === 'supplier'){
        schedule.andWhere('User.id = :id', {id: id})
      } 
      const res = await schedule.getMany()
    return res;
  }

  async findOne(id: number) {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
      .select(['Schedule.id', 'Schedule.name', 'Schedule.alias'])
      .addSelect(['Turn.id', 'Turn.dateFrom', 'Turn.dateTo', 'Turn.classDayType'])
      .addSelect(['Type.id', 'Type.name'])
      .leftJoin('Schedule.turn', 'Turn')
      .leftJoinAndSelect('Turn.sign', 'sign')
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

  async remove(updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({ where: { id: updateScheduleDto.id } })
    if (!schedule) {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe una agenda con el id ${updateScheduleDto.id} ingresado o ya esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      schedule.active = false
      this.scheduleRepository.save(schedule)
      return schedule;
    }

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
  async syncWithGoogleCalendar(reservedTurns: any, calendarId: any) {
    // Implementa la lógica de sincronización aquí
    await this.googleCalendarService.syncEvents(reservedTurns, calendarId);
  }
  //aca esta el problema

  
}
