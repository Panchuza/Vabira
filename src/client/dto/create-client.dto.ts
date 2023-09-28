import { PartialType } from "@nestjs/swagger"
import { IsNotEmpty, IsObject } from "class-validator"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { CreateUserDto } from "src/users/dto/create-user.dto"

export class CreateClientDto extends PartialType(CreateUserDto){

    @IsObject()
    @IsNotEmpty()
    address: CreateAddressDto;
}
