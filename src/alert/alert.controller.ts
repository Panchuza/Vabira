import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('alertForClient')
  async getAlerts(@Query('id') id: string) {
    return this.alertService.getAlertsForClient(id);
  }

  @Get('alertForSupplier')
  async getAlerts2(@Query('id') id: string) {
    return this.alertService.getAlertsForSupplier(id);
  }
  
}
