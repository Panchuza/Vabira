import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as path from 'path'; 
import { PurchaseRecordService } from './purchase-record.service';
import { CreatePurchaseRecordDto } from './dto/create-purchase-record.dto';
import { UpdatePurchaseRecordDto } from './dto/update-purchase-record.dto';
import { Product } from 'src/entities/product.entity';

@Controller('purchaseRecord')
export class PurchaseRecordController {
  constructor(private readonly purchaseRecordService: PurchaseRecordService) {}

  @Post()
  create(@Body() createPurchaseRecordDto: CreatePurchaseRecordDto) {
    return this.purchaseRecordService.create(createPurchaseRecordDto);
  }

  @Get('/all')
  findAll() {
    return this.purchaseRecordService.findAll();
  }

  @Get('downloadPDF')
async downloadPDF(@Query('id') id: number, @Res() res): Promise<void> {
  const purchaseRecord = await this.purchaseRecordService.findOneWithProducts(id);

  if (!purchaseRecord) {
    throw new BadRequestException('No se encontró la orden de compra');
  }

  // Crea un nuevo documento PDF utilizando pdfkit
  const doc = new PDFDocument();

  // Agrega contenido al PDF (ajusta esto según tu estructura de datos)
  const imagePath = path.join(process.cwd(), 'vabira.jpeg');
  doc.image(imagePath, { width: 100, height: 100 }); // Ajusta el ancho y alto según tus necesidades
  doc.fontSize(12).text(`Orden de Compra Id: ${purchaseRecord.id}`);
  doc.fontSize(10).text(`Fecha de Compra: ${purchaseRecord.purchaseDateTime}`);
  doc.fontSize(10).text(`Proveedor que realizo la venta: ${purchaseRecord.supplier.user.firstName} ${purchaseRecord.supplier.user.lastName}`);
  doc.fontSize(10).text(`Monto Total: ${purchaseRecord.purchaseAmount}`);
  let quantity = 0
  for (let i = 0; i < purchaseRecord.product.length; i++) {
    quantity++
  }
  doc.fontSize(10).text(`Cantidad: ${quantity}`);

  doc.fontSize(12).text('Productos:');
  purchaseRecord.product.forEach((product: Product) => {
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRecordDto: UpdatePurchaseRecordDto) {
    return this.purchaseRecordService.update(+id, updatePurchaseRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRecordService.remove(+id);
  }
}
