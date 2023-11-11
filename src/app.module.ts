import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { Config } from './config/data.source';
import { HttpModule} from '@nestjs/axios';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeModule } from './type/type.module';
import { TurnModule } from './turn/turn.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClientModule } from './client/client.module';
import { SupplierModule } from './supplier/supplier.module';
import { CountryModule } from './country/country.module';
import { PoliticalDivisionModule } from './political-division/political-division.module';
import { ContinentModule } from './continent/continent.module';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';
import { FaqModule } from './faq/faq.module';
import { SaleRecordModule } from './sale-record/sale-record.module';
import { PurchaseRecordModule } from './purchase-record/purchase-record.module';


const envFilePath: string = getEnvPath(`${__dirname}/../common/envs`);

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   autoLoadEntities: true
    // }),
    // useFactory: (configService: ConfigService) => ({...Config, autoLoadEntities: true}),

    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    //  TypeOrmModule.forRoot(Config),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => Config,
      inject: [ConfigService],
    }),
    AuthModule,
    TypeModule,
    UsersModule,
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
    TurnModule,
    ScheduleModule,
    ClientModule,
    SupplierModule,
    CountryModule,
    PoliticalDivisionModule,
    ContinentModule,
    RegionModule,
    ProductModule,
    FaqModule,
    SaleRecordModule,
    PurchaseRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
