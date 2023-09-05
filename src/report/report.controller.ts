import { Body, Controller, Get, Query } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportProjection } from "./dto/reportProjection.dto";
import { SupplierReportDto } from "./dto/supplierReport.dto";

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('projection')
  getProjectionReport(
    @Query('clientId') clientId: number,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('statusId') statusId: number,
  ) {
    return this.reportService.getProjectionReport(clientId, dateFrom, dateTo, statusId)
  }

  @Get('integrative')
  getIntegrativeReport(
    @Query('clientId') clientId: number,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string
  ) {
    return this.reportService.getIntegrativeReport(clientId, dateFrom, dateTo)
  }


  @Get('supplierReport')
  getSupplierReport(@Query() supplierReportDto: SupplierReportDto){
    return this.reportService.getReportSupplier(supplierReportDto)
  }
}