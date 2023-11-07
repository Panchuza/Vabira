import { Controller, Get, Post, Body, Patch, Param, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) { }

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  // @Post('create')
  // create(@Body() createProductDto: CreateProductDto, 
  // @Headers('authorization') token: string,) {
  //   if (!token) {
  //     throw new HttpException(
  //       'Token no proporcionado',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   const access: any[] = this.authService.validateAccess(token);

  //   if (access.includes('Crear Producto')) {
  //     return this.productService.create(createProductDto);
  //   } else {
  //     throw new HttpException(
  //       'No tenés acceso a esta operación',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  // }

  @Get('all')
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  @Patch('/delete')
  remove(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.remove(updateProductDto);
  }
}
