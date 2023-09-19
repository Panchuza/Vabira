import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';
import { Turn } from 'src/entities/turn.entity';
import * as dateFns from 'date-fns';

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
    const schedule = []; // Aquí almacenaremos los turnos generados

    // Convierte las horas de inicio y fin en objetos de fecha
    const startTime = dateFns.parse(initialTurnDateTime, 'HH:mm', new Date());
    const endTime = dateFns.parse(finalTurnDateTime, 'HH:mm', new Date());

    // Genera los turnos para cada día seleccionado
    for (const day of days) {
      let currentTime = startTime;

      while (dateFns.isBefore(currentTime, endTime)) {
        // Crea un nuevo turno
        const turn = {
          day,
          time: dateFns.format(currentTime, 'HH:mm'),
        };

        // Agrega el turno a la agenda
        schedule.push(turn);

        // Incrementa el tiempo actual según la duración del turno
        currentTime = dateFns.addMinutes(currentTime, turnDuration);
      }
    }

    // Aquí puedes guardar la agenda generada en la base de datos si es necesario

    return schedule;
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
