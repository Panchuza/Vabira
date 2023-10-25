import { IsNotEmpty } from "class-validator"
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

    @IsNotEmpty()
    minimum_stock: number

    @IsNotEmpty()
    expiry_date: string

    @IsNotEmpty()
    image: string

    // @IsNotEmpty()
    // productType: Type

}
