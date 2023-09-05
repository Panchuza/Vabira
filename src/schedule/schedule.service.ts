import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async create(createScheduleDto: CreateScheduleDto) {
    const newSchedule = new Schedule();
    newSchedule.name = createScheduleDto.name;
    newSchedule.hasSign = createScheduleDto.hasSign;
    newSchedule.classDayType = createScheduleDto.classDayType;
    newSchedule.turnero = createScheduleDto.turnero;
    newSchedule.supplier = createScheduleDto.supplier;
  
    // Guarda la agenda en la base de datos
    const savedSchedule = await getRepository(Schedule).save(newSchedule);
  
    // Define los días laborables de la semana (Lunes a Viernes)
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
    // Define los horarios de inicio y fin
    const startTime = '08:00';
    const endTime = '20:00';
  
    // Divide el tiempo en intervalos de 1 hora
    const interval = 60; // minutos
  
    // Crea los turnos para cada día laborable y horario
    for (const day of weekdays) {
      let currentTime = startTime;
      while (currentTime <= endTime) {
        // Crea un nuevo turno para el día actual y hora actual
        // const newTurn = new Turn();
        newTurn.dayOfWeek = day;
        newTurn.startTime = currentTime;
        newTurn.schedule = savedSchedule;
  
        // Guarda el turno en la base de datos
        // await getRepository(Turn).save(newTurn);
  
        // Incrementa la hora actual en intervalos de 1 hora
        const [hours, minutes] = currentTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setMinutes(date.getMinutes() + interval);
        currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    }
  
    return savedSchedule; // Devuelve la agenda creada
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
