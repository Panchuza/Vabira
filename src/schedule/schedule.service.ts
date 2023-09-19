import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';
import { Turn } from 'src/entities/turn.entity';
import * as dateFns from 'date-fns';
import { Type } from 'src/entities/type.entity';

@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const { days, initialTurnDateTime, finalTurnDateTime, turnDuration } = createScheduleDto;
  
    // Convierte las horas de inicio y fin en objetos de fecha
    const startTime = dateFns.parse(initialTurnDateTime, 'HH:mm', new Date());
    const endTime = dateFns.parse(finalTurnDateTime, 'HH:mm', new Date());
  
    // Obtén los registros de ClassDayType que coinciden con los días seleccionados
    const classDayTypes = await this.entityManager.find(Type, {
      where: days.map(day => ({ name: day }))
    });
  
    const savedSchedule = await this.entityManager.transaction(async transactionalEntityManager => {
      // Crea una nueva instancia de Schedule
      const schedule = new Schedule();
      schedule.name = createScheduleDto.name
      schedule.hasSign = createScheduleDto.hasSign
      schedule.name = createScheduleDto.name
      schedule.turnDuration = createScheduleDto.turnDuration
      schedule.initialTurnDateTime = startTime.toISOString()
      schedule.finalTurnDateTime = endTime.toISOString()
      schedule.supplier = createScheduleDto.supplier
      // Puedes asignar más propiedades a 'schedule' si es necesario
  
      // Guarda el Schedule en la base de datos
      const savedSchedule = await transactionalEntityManager.save(Schedule, schedule);
  
      // Genera los turnos para cada día seleccionado y asígnalos al Schedule
      for (const day of classDayTypes) {
        let currentTime = startTime;
  
        while (dateFns.isBefore(currentTime, endTime)) {
          // Crea un nuevo turno y asígnale el Schedule
          const newTurn = new Turn();
          newTurn.dateFrom = currentTime as any;
          newTurn.dateTo = dateFns.addMinutes(currentTime, turnDuration) as any;
          newTurn.classDayType = day;
          newTurn.schedule = savedSchedule; // Asigna el Schedule al turno
  
          // Guarda el Turno en la base de datos
          await transactionalEntityManager.save(Turn, newTurn);
  
          // Incrementa el tiempo actual según la duración del turno
          currentTime = dateFns.addMinutes(currentTime, turnDuration);
        }
      }
  
      // Devuelve el Schedule guardado con los turnos relacionados
      return savedSchedule;
    });
  
    // Devuelve el Schedule con los turnos relacionados
    return savedSchedule;
  }
  



  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
