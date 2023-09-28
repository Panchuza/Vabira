import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateSupplierDto extends PartialType(CreateUserDto){

    @IsNotEmpty({message: 'El numero de identificador es un campo obligatorio'})
    identificationNumber: string

    @IsNotEmpty({message: 'El cuit es un campo obligatorio'})
    cuit: string 

}
