import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DbException } from 'src/exception/dbException';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) { }


  async create(createProductDto: CreateProductDto) {

    const { code, ...toCreate } = createProductDto

    try {
      if (!(await this.validateCode(code))) {
        const productDto = await this.productRepository.create({
          code,
          ...toCreate
        })
        productDto.name = toCreate.name
        productDto.code = code
        productDto.brand = toCreate.brand
        productDto.description = toCreate.description
        productDto.prize = toCreate.prize
        productDto.quantity = toCreate.quantity
        // productDto.stock = toCreate.stock
        productDto.caducityDatetime = toCreate.caducityDatetime

        let result: Product
        await this.entityManager.transaction(async (transaction) => {
          try {
            result = await transaction.save(productDto)

          } catch (error) {
            console.log(error);
            throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        })
        return {
          status: HttpStatus.CREATED,
          data: result,
        }
      } else {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Ya existe un producto con el codigo ingresado',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw new DbException("Error de validación", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateCode(code: string) {
    const productFound = await this.productRepository.findOne({ where: { code: code } })
    return !!productFound
  }

  async findAll() {
    const products = await this.productRepository.createQueryBuilder('Product')
      .select(['Product.id', 'Product.name', 'Product.brand', 'Product.code', 'Product.quantity', 'Product.prize', 'Product.description'])
      .getMany();
    return products
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  async remove(updateProductDto: UpdateProductDto) {    
    const product = await this.productRepository.findOne({ where: { id: updateProductDto.id } })
    
    if (product) {
      await this.productRepository.remove(product)
    } else {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un producto con el id ${product.id} ingresado o ya esta dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
