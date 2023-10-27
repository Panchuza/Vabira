import { PartialType } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsObject } from "class-validator"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { CreateClientAddressDto } from "src/address/dto/create-clientaddress.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto"

export class CreateClientDto extends PartialType(CreateUserDto){

    @IsArray()
    // @IsNotEmpty()
    clientAddress: CreateClientAddressDto[];
}
