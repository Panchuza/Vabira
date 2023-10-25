

import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/create')
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get('/all')
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Company> {
    const company = await this.companyService.findOne(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCompanydto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyService.update(id, updateCompanydto);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }


  @Delete('/delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    const company = await this.companyService.findOne(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    await this.companyService.remove(id);
  }
}
