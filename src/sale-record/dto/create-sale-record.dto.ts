import { IsArray, IsNotEmpty, IsObject } from "class-validator"
import { Type as Typet } from "class-transformer"
import { AssignDto } from "src/common/dtos/assign.dto";
import { Product } from "src/entities/product.entity";

export class CreateSaleRecordDto {

    @Typet(() => AssignDto)
    @IsObject()
    client: AssignDto

    @Typet(() => AssignDto)
    @IsObject()
    supplier: AssignDto

    @IsNotEmpty()
    saleAmount: number
    
    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    saleDateTime: string

    @IsArray()
    product: Product[]


}

