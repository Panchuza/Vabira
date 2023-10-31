import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';
import { Alert } from '../entities/alert.entity';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  async getAlerts(): Promise<Alert[]> {
    return this.alertService.getAlerts();
  }
}
