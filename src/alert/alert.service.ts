import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    ) {}


  async getAlertsForClient(id: string) {
    const alerts = await this.alertRepository.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.turn', 'turn')
      .leftJoinAndSelect('turn.client', 'client')
      .leftJoinAndSelect('turn.turnStatus', 'turnStatus')
      .leftJoinAndSelect('turnStatus.turnStatusType', 'turnStatusType')
      .where('client.id = :clientId', { clientId: id })
      .andWhere('turnStatusType.code = :code' , {code: 'TurnoReservado'})
      .getMany();
    return alerts;
  }

  async getAlertsForSupplier(id: string) {
    const alerts = await this.alertRepository.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.turn', 'turn')
      .leftJoinAndSelect('turn.client', 'client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('turn.schedule', 'schedule')
      .leftJoinAndSelect('turn.sign', 'sign')
      .leftJoinAndSelect('sign.signStatus', 'signStatus')
      .leftJoinAndSelect('signStatus.signStatusType', 'signStatusType')
      .leftJoinAndSelect('turn.turnStatus', 'turnStatus')
      .leftJoinAndSelect('turnStatus.turnStatusType', 'turnStatusType')
      .leftJoinAndSelect('schedule.supplier', 'supplier')
      .where('supplier.id = :supplierId', { supplierId: id })
      .andWhere('turnStatusType.code = :code OR turnStatusType.code = :senaCode', { code: 'TurnoReservado', senaCode: 'SeñaEsperandoAprobacion'  } )
      .getMany();
  
    return alerts;
  }
  
  

}
