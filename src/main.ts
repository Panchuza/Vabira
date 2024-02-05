import * as dotenv from 'dotenv';
dotenv.config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './interceptor/errors.interceptor';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { urlencoded, json } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      //bufferLogs: true,
      logger: console,
    }
  );
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu aplicación Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  //config
  const config = new DocumentBuilder()
    .setTitle('Vabira')
    .setDescription('Proyectofinal')
    .setVersion('1.0')
    .setBasePath('api-docs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(3000)
}
bootstrap();