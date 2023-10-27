import { IsNotEmpty, IsObject, IsOptional, IsString, Length, ValidateNested } from "@nestjs/class-validator";
import { Type as Typet } from "class-transformer"
import { AssignDto } from "src/common/dtos/assign.dto";
import { CreateAddressDto } from "./create-address.dto";

export class CreateClientAddressDto {

    @IsObject()
    @IsNotEmpty()
    address: CreateAddressDto;

}
