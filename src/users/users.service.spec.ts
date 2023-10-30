import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('UsersController - Validación de Formato de Nombre de Usuario (CPVI-01)', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should throw an error for invalid username format', async () => {
    const createUserDto: CreateUserDto = {
      dni: '123456789',
      username: 'User 23', // Invalid format due to space
      firstName: 'John',
      lastName: 'Doe',
      email: 'user23@gmail.com',
      password: 'password123',
    };

    jest.spyOn(userService, 'validation').mockResolvedValue(true);

    try {
      await controller.create(createUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Formato de nombre de usuario incorrecto.');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});
describe('UsersController - Validación de Formato de Email (CPVI-02)', () => {
  // ...

  it('should throw an error for invalid email format', async () => {
    const createUserDto: CreateUserDto = {
      dni: '123456789',
      username: 'User23',
      firstName: 'John',
      lastName: 'Doe',
      email: 'user23.com', // Invalid email format (missing @ symbol)
      password: 'password123',
    };

    jest.spyOn(userService, 'validation').mockResolvedValue(true);

    try {
      await controller.create(createUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Formato de correo electrónico incorrecto.');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});
describe('UsersController - Validación de Campos Obligatorios (CPVI-03)', () => {
  // ...

  it('should throw an error for empty required fields', async () => {
    const createUserDto: CreateUserDto = {
      dni: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    jest.spyOn(userService, 'validation').mockResolvedValue(true);

    try {
      await controller.create(createUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Todos los campos obligatorios deben completarse.');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});

import { SiseService } from './sise.service';
import { SiseController } from './sise.controller';
import { BrechasComision } from './brechasComision.type';
import { Test } from '@nestjs/testing';
//import { beforeAll, describe, it } from 'node:test';
import {  expect, describe, it, beforeAll } from '@jest/globals';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrechaComisionHistorico } from '../entities/historico.entity';
import { BrechaComisionError } from '../entities/index.entity';
import { BrechaComisionVigente } from '../entities/vigente.entity';
import { SiseRepository } from './sise.repository';
import { AppModule } from '../app.module';
 

const mockSiseResponseVigente = `<su:response xmlns:su="http://www.segurossura.com.ar/Schemas/Univers/Subroutine/xml">

<su:result>

    <message sessionid="testBrechaComisionOk">

        <response status="0" message=""/>

        <Header>Productor,Producto,Ramo,Nivel,Moneda,RecAdm,ComPro,ComOrg,ComCob,ComAin</Header>

        <Data>00019,00114,01,99,01,19.50,34.00,0.00,0.00,0.00;00019,00114,02,99,01,24.00,29.00,0.00,0.00,0.00;00019,00114,03,99,01,25.50,24.00,0.00,0.00,0.00;00019,00114,04,99,01,31.50,24.00,0.00,0.00,0.00;00019,00114,05,99,01,22.50,24.00,0.00,0.00,0.00</Data>

    </message>

</su:result>

<su:status>

    <su:code>01</su:code>

    <su:description>SUCCESS</su:description>

</su:status>

</su:response>`

 

const mockSiseResponseError = `<su:response xmlns:su="http://www.segurossura.com.ar/Schemas/Univers/Subroutine/xml">

<su:result>

    <message sessionid="testBrechaComisionError">

        <response status="0" message=""/>

        <Header>Productor,Producto,Ramo,Nivel,Moneda,RecAdm,ComPro,ComOrg,ComCob,ComAin</Header>

        <Data>00019,00114,01,99,01,19.50,34.00,0.00,0.00,0.00;00019,00114,02,99,01,24.00,29.00,0.00,0.00,casa</Data>

    </message>

</su:result>

<su:status>

    <su:code>01</su:code>

    <su:description>SUCCESS</su:description>

</su:status>

</su:response>`

 

describe('SiseService', () => {

  let siseService: SiseService;
  //let siseController: SiseController;

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports:[AppModule,HttpModule, TypeOrmModule.forFeature([BrechaComisionError,BrechaComisionHistorico, BrechaComisionVigente]
        )],
      controllers: [SiseController],
      providers: [SiseService, SiseRepository],
    }).compile();

  siseService = moduleRef.get<SiseService>(SiseService);
  }, 30000);
  

 

  it('debería importar datos exitosamente',  () => {

    const result:BrechasComision =  siseService.formatSiseResponse(mockSiseResponseVigente);
    console.log('Resultado Exitoso: ' + JSON.stringify(result,null,2))
    expect(result.data).toEqual(expect.any(Array));
    expect(result.errors).toEqual([]); 

  });

 

  it('debería manejar errores en la importación de datos', () => {

    const result:BrechasComision = siseService.formatSiseResponse(mockSiseResponseError);
    console.log('Resultado Erroneo: ' + JSON.stringify(result,null,2))
    expect(result.errors).toEqual(expect.any(Array));

  });

});