import { SaleRecordService } from './sale-record.service';
import { CreateSaleRecordDto } from './dto/create-sale-record.dto';
import { UpdateSaleRecordDto } from './dto/update-sale-record.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';
import { format } from 'date-fns';
import { Product } from 'src/entities/product.entity';

@Controller('saleRecord')
export class SaleRecordController {
  constructor(private readonly saleRecordService: SaleRecordService) {}

  @Post('create')
  create(@Body() createSaleRecordDto: CreateSaleRecordDto) {
    return this.saleRecordService.create(createSaleRecordDto);
  }

  @Get('all')
  findAll() {
    return this.saleRecordService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.saleRecordService.findOne(+id);
  // }

  @Get('downloadPDF')
  async downloadPDF(@Query('id') id: number, @Res() res): Promise<void> {
    const saleRecord = await this.saleRecordService.findOneWithProducts(id);

    if (!saleRecord) {
      throw new BadRequestException('No se encontró la orden de venta');
    }

    // Crea un nuevo documento PDF utilizando pdfkit
    const doc = new PDFDocument();

    const formattedPurchaseDate = format(new Date(saleRecord.saleDateTime), 'dd-MM-yyyy');
    // Agrega contenido al PDF (ajusta esto según tu estructura de datos)
    const imagePath = path.join(process.cwd(), 'logo-t-1.png');
    doc.image(imagePath, { width: 100, height: 100 }); // Ajusta el ancho y alto según tus necesidades
    doc.fontSize(12).text(`Orden de Venta Id: ${saleRecord.id}`);
    doc.fontSize(10).text(`Fecha de Venta: ${formattedPurchaseDate}`);
    doc.fontSize(10).text(`Proveedor que realizo la venta: ${saleRecord.supplier.user.firstName} ${saleRecord.supplier.user.lastName}`);
    doc.fontSize(10).text(`Cliente que realizo la compra: ${saleRecord.client.user.firstName} ${saleRecord.client.user.lastName}`);
    doc.fontSize(10).text(`Monto Total: ${saleRecord.saleAmount}`);
    let quantity = 0
    for (let i = 0; i < saleRecord.product.length; i++) {
      quantity++
    }
    doc.fontSize(10).text(`Cantidad de productos vendidos: ${quantity}`);

    doc.fontSize(12).text('Productos:');
    saleRecord.product.forEach((product: Product) => {
      doc.fontSize(10).text(`- Id: ${product.id}, Nombre: ${product.name}, Codigo: ${product.code}, Precio: ${product.prize}`);
    });

    // Agrega la imagen al final del PDF

    // Reemplaza 'ruta/imagen.png' con la ruta real de tu imagen

    // Configura las cabeceras para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; filename="orden_compra_${id}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipea el PDF directamente a la respuesta HTTP
    doc.pipe(res);

    // Finaliza el PDF
    doc.end();
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
