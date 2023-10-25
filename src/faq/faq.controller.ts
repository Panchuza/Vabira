// src/faq/faq.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { FaqService } from './faq.service';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto } from '../faq/dto/create-faq.dto';
import { UpdateFaqDto } from '../faq/dto/update-faq.dto';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('all')
  async findAll(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Faq> {
    const faq = await this.faqService.findOne(id);
    if (!faq) {
      throw new NotFoundException(`Faq with ID ${id} not found`);
    }
    return faq;
  }

  @Post('/create')
  async create(@Body() createFaqDto: CreateFaqDto): Promise<Faq> {
    return this.faqService.create(createFaqDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const faq = await this.faqService.update(id, updateFaqDto);
    if (!faq) {
      throw new NotFoundException(`Faq with ID ${id} not found`);
    }
    return faq;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const faq = await this.faqService.findOne(id);
    if (!faq) {
      throw new NotFoundException(`Faq with ID ${id} not found`);
    }
    await this.faqService.remove(id);
  }

  @Put('/update/:id') // Ruta para actualizar una FAQ específica por ID
  async updateFaq(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto): Promise<Faq> {
    try {
      const updatedFaq = await this.faqService.update(id, updateFaqDto);
      return updatedFaq;
    } catch (error) {
      throw new NotFoundException(`Faq with ID ${id} not found`);
    }
  }

}
