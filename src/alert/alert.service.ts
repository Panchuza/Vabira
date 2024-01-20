import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      .where('client.id = :clientId', { clientId: id })
      .getMany();
    return alerts;
  }

  async getAlertsForSupplier(id: string) {
    const alerts = await this.alertRepository.createQueryBuilder('alert')
    .leftJoinAndSelect('alert.turn', 'turn')
    .leftJoinAndSelect('turn.client', 'client')
    .leftJoinAndSelect('turn.schedule', 'schedule')
    .leftJoinAndSelect('schedule.supplier', 'supplier')
    .where('supplier.id = :supplierId', { supplierId: id })
    .getMany();
      
    return alerts;
  }

}
