import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { TypeService } from 'src/type/type.service';
import { ServiceAttendanceControlSheet } from "src/entities/serviceAttendanceControlSheet.entity";
import { GroupSupplier } from 'src/entities/groupSupplier.entity';
import { Fee } from 'src/entities/fee.entity';
import { Group } from "src/entities/group.entity";
import { Type } from "src/entities/type.entity";
import { Supplier } from "src/entities/supplier.entity";
import { Client } from "src/entities/client.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceAttendanceControlSheet,Fee,GroupSupplier, Group, Type, Supplier,
      Client
    ]
    ),
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    })
  ],
  controllers: [ReportController],
  providers: [
    ReportService, TypeService
  ]
})

export class ReportModule {}