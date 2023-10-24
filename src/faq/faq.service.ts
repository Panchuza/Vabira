// src/faq/faq.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto } from '../faq/dto/create-faq.dto';
import { UpdateFaqDto } from '../faq/dto/update-faq.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async findAll(): Promise<Faq[]> {
    return await this.faqRepository.find();
  }

async findOne(id: number): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
        throw new NotFoundException(`Faq with ID ${id} not found`);
    }
    return faq;
}

//   async create(createFaqDto: CreateFaqDto): Promise<Faq> {
//     const { name, description, userId } = createFaqDto;
//     const faq = this.faqRepository.create({ name, description });
//     //faq.user = { id: userId } as User; // Asigna el usuario a la FAQ
//     return await this.faqRepository.save(faq);
//   }
async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const { name, description } = createFaqDto;
    const faq = this.faqRepository.create({ name, description });
    return await this.faqRepository.save(faq);
  }


  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    await this.findOne(id); // Verifica si la FAQ existe
    await this.faqRepository.update(id, updateFaqDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verifica si la FAQ existe
    await this.faqRepository.delete(id);
  }
}
