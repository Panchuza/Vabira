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

    // @IsNotEmpty()
    // stock: number

    @IsNotEmpty()
    caducityDatetime: string

    // @IsNotEmpty()
    // image: string

    // @IsNotEmpty()
    // productType: Type

}
