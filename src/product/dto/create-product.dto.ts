import { IsNotEmpty } from "class-validator"
import { Type } from "src/entities/type.entity"

export class CreateProductDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    brand: string

    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    prize: number

    @IsNotEmpty()
    image: string

    @IsNotEmpty()
    productType: Type

}
