import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DbException } from 'src/exception/dbException';
import { PurchaseRecord } from 'src/entities/purchaseRecord.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectEntityManager()
    private entityManager: EntityManager
  ) { }


  async create(createProductDto: CreateProductDto) {
    const { code, quantity, ...toCreate } = createProductDto;
    const createdProducts: Product[] = [];

    try {
      // Obtén el último valor de codeForBatch
      const lastBatch = await this.productRepository.createQueryBuilder('product')
        .select('MAX(product.codeForBatch)', 'lastBatch')
        .getRawOne();

      const lastBatchValue = lastBatch ? lastBatch.lastBatch || 0 : 0;

      for (let i = 0; i < quantity; i++) {
        const productDto = await this.productRepository.create({
          code: code + i,
          codeForBatch: lastBatchValue + 1,
          quantity: quantity,
          active: true,
          ...toCreate,
        });
        createdProducts.push(productDto);
      }
      const supplierFound = await this.supplierRepository.findOne({ where: { id: createProductDto.supplierId.id } })
      let results: Product[] = [];
      await this.entityManager.transaction(async (transaction) => {
        try {
          // Guarda todos los productos en una transacción
          results = await transaction.save(createdProducts);

          // Crea una nueva orden de compra
          const orderRecord = transaction.create(PurchaseRecord);

          orderRecord.purchaseAmount = quantity * toCreate.prize;
          orderRecord.supplier = supplierFound;

          // Guarda la orden de compra
          await transaction.save(orderRecord);

          // Asigna PurchaseRecord_Id a cada producto creado
          for (const product of results) {
            product.purchaseRecord = orderRecord;
            await transaction.save(Product, product);
          }
        } catch (error) {
          console.log(error);
          throw new DbException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });

      return {
        status: HttpStatus.CREATED,
        data: results,
      };
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
      .select(['Product.id', 'Product.name', 'Product.brand', 'Product.code', 'Product.quantity', 'Product.prize', 'Product.description', 'Product.codeForBatch'])
      .where('Product.active = 1')
      .getMany();
    return products
  }

  async findAll2() {
    const query = `
    SELECT
    Product.Id AS Product_Id,
    Product.Name AS Product_Name,
    Product.Code AS Product_Code,
    Product.Brand AS Product_Brand,
    Product.Description AS Product_Description,
    Product.Quantity AS Product_Quantity,
    Product.CodeForBatch AS Product_CodeForBatch,
    Product.Prize AS Product_Prize
FROM
    Product
WHERE
    Product.Id NOT IN (
        SELECT MIN(P2.Id)
        FROM Product P2
        WHERE P2.CodeForBatch = Product.CodeForBatch
    )
    AND Product.Active = 1;`;

    const products = await this.productRepository.query(query);

    // Agrupar productos por codeForBatch
    const productsByCodeForBatch = {};

    for (const product of products) {
      const codeForBatch = product.Product_CodeForBatch;
      if (!productsByCodeForBatch[codeForBatch]) {
        productsByCodeForBatch[codeForBatch] = [];
      }
      productsByCodeForBatch[codeForBatch].push(product);
    }

    return productsByCodeForBatch;
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
      // Obtén el codeForBatch del producto antes de eliminarlo
      const codeForBatch = product.codeForBatch;

      product.active = false;

      // Elimina el producto de la base de datos
      await this.productRepository.save(product);

      // Actualiza la cantidad de productos con el mismo codeForBatch
      await this.decreaseQuantityForBatch(codeForBatch);
    } else {
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No existe un producto con el id ${product.id} ingresado o ya está dado de baja`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Método para disminuir en 1 la cantidad de productos con el mismo codeForBatch
  private async decreaseQuantityForBatch(codeForBatch: number): Promise<void> {
    const productsWithSameBatch = await this.productRepository.find({
      where: { codeForBatch: codeForBatch },
    });

    for (const product of productsWithSameBatch) {
      // Asegúrate de que la cantidad no sea menor que cero
      product.quantity = Math.max(0, product.quantity - 1);

      // Guarda los cambios en la base de datos
      await this.productRepository.save(product);
    }
  }

}
