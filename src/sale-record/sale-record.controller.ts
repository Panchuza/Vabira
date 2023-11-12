import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SaleRecordService } from './sale-record.service';
import { CreateSaleRecordDto } from './dto/create-sale-record.dto';
import { UpdateSaleRecordDto } from './dto/update-sale-record.dto';

@Controller('sale-record')
export class SaleRecordController {
  constructor(private readonly saleRecordService: SaleRecordService) {}

  @Post()
  create(@Body() createSaleRecordDto: CreateSaleRecordDto) {
    return this.saleRecordService.create(createSaleRecordDto);
  }

  @Get()
  findAll() {
    return this.saleRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleRecordDto: UpdateSaleRecordDto) {
    return this.saleRecordService.update(+id, updateSaleRecordDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.saleRecordService.remove(id);
  // }
}
