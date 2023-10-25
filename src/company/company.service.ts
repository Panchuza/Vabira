// company.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity'; // Asegúrate de tener la importación correcta para la entidad
import { CreateCompanyDto } from './dto/create-company.dto'; // Importa el DTO para crear una compañía
import { UpdateCompanyDto } from './dto/update-company.dto'; // Importa el DTO para actualizar una compañía

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { nombre, email, direccion, sitioWeb, descripcion, telefono } = createCompanyDto;
    const company = this.companyRepository.create({ nombre, email, direccion, sitioWeb, descripcion, telefono });
    return await this.companyRepository.save(company);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    await this.findOne(id); // Verifica si la compañía existe
    await this.companyRepository.update(id, updateCompanyDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verifica si la compañía existe
    await this.companyRepository.delete(id);
  }
}
