import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { Config } from './config/data.source';
import { HttpModule} from '@nestjs/axios';



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
    UsersModule,
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
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
