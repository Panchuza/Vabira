import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';
import { Turn } from 'src/entities/turn.entity';

@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async create(createScheduleDto: CreateScheduleDto) {

    const { initialTurnDateTime, finalTurnDateTime, turnDuration, ...toCreate } = createScheduleDto;
    const scheduleDto = await this.scheduleRepository.create({
      ...toCreate
    })

    scheduleDto.initialTurnDateTime = createScheduleDto.initialTurnDateTime
    scheduleDto.finalTurnDateTime = createScheduleDto.finalTurnDateTime
    scheduleDto.turnDuration = createScheduleDto.turnDuration

    
    // Define los días laborables de la semana (Lunes a Viernes)
    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  
    // // Define los horarios de inicio y fin
    // const startTime = '08:00';
    // const endTime = '20:00';
  
    // // Divide el tiempo en intervalos de 1 hora
    // const interval = 60; // minutos
  
    // Crea los turnos para cada día laborable y horario
    for (const day of weekdays) {
      let currentTime = scheduleDto.initialTurnDateTime;
      while (currentTime <= scheduleDto.finalTurnDateTime) {
        // Crea un nuevo turno para el día actual y hora actual
        const newTurn = new Turn();
        // newTurn.classDayType = day;
        newTurn.dateFrom = currentTime;
        newTurn.dateTo = currentTime + scheduleDto.turnDuration.toString();
        // newTurn.schedule = savedSchedule;
  
        // Guarda el turno en la base de datos
        // await getRepository(Turn).save(newTurn);
  
        // Incrementa la hora actual en intervalos de 1 hora
        const [hours, minutes] = currentTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setMinutes(date.getMinutes() + scheduleDto.turnDuration);
        currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    }
  
    // return savedSchedule; // Devuelve la agenda creada
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
