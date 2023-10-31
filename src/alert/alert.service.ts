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

  async getAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({
      relations: ['turn', 'turn.schedule', 'turn.client'],
    });
  }
  
}
