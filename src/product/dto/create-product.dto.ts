import { IsNotEmpty, IsObject, IsOptional } from "class-validator"
import { Supplier } from "src/entities/supplier.entity"
import { Type } from "src/entities/type.entity"

export class CreateProductDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    brand: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    prize: number
    
    @IsNotEmpty()
    quantity: number

    @IsObject()
    @IsOptional()
    supplierId: Supplier

    // @IsNotEmpty()
    // stock: number

    @IsNotEmpty()
    caducityDatetime: string

    // @IsNotEmpty()
    // image: string

    // @IsNotEmpty()
    // productType: Type

}
