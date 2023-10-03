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

@Injectable()
export class ScheduleService {

  constructor(

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectEntityManager()
    private entityManager: EntityManager,

  ) { }

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const { days, initialTurnDateTime, finalTurnDateTime, turnDuration } = createScheduleDto;
    const startTime = dateFns.parse(initialTurnDateTime, 'HH:mm', new Date());
    const endTime = dateFns.parse(finalTurnDateTime, 'HH:mm', new Date());
    const classDayTypes = await this.entityManager.find(Type, {
      where: days.map(day => ({ name: day }))
    });
  
    const supplierFound = await this.supplierRepository.findOne({where: {id: createScheduleDto.supplier.id}})
    const savedSchedule = await this.entityManager.transaction(async transactionalEntityManager => {
      const schedule = new Schedule();
      schedule.name = createScheduleDto.name
      schedule.hasSign = createScheduleDto.hasSign
      schedule.name = createScheduleDto.name
      schedule.turnDuration = createScheduleDto.turnDuration
      schedule.initialTurnDateTime = startTime.toISOString()
      schedule.finalTurnDateTime = endTime.toISOString()
      schedule.supplier = supplierFound
      const savedSchedule = await transactionalEntityManager.save(Schedule, schedule);
  
      for (const day of classDayTypes) {
        let currentTime = startTime;
  
        while (dateFns.isBefore(currentTime, endTime)) {
          const newTurn = new Turn();
          newTurn.dateFrom = currentTime as any;
          newTurn.dateTo = dateFns.addMinutes(currentTime, turnDuration) as any;
          newTurn.classDayType = day;
          newTurn.schedule = savedSchedule;
          newTurn.supplier = supplierFound


          await transactionalEntityManager.save(Turn, newTurn);
  
          currentTime = dateFns.addMinutes(currentTime, turnDuration);
        }
      }
  
      return savedSchedule;
    });

    return savedSchedule;
  }
  



  async findAll() {
    const schedule = await this.scheduleRepository.createQueryBuilder('Schedule')
    .select(['Schedule.id', 'Schedule.name'])
    .addSelect(['Turn.id', 'Turn.dateFrom', 'Turn.dateTo', 'Turn.classDayType'])
    .addSelect(['Type.id', 'Type.name'])
    .innerJoin('Schedule.turn', 'Turn')
    .innerJoin('Turn.classDayType', 'Type')
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
    .where('Schedule.id = :id', {id: id})
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
}
