import { IsNotEmpty, IsObject, IsOptional, IsString, Length, ValidateNested } from "@nestjs/class-validator";
import { Type as Typet } from "class-transformer"
import { AssignDto } from "src/common/dtos/assign.dto";

export class CreateAddressDto {
    @Length(0, 100)
    @IsString()
    @IsNotEmpty()
    address: string;

    @ValidateNested()
    @Typet(() => AssignDto)
    @IsObject()
    @IsNotEmpty()
    addressType: AssignDto

    @ValidateNested()
    @Typet(() => AssignDto)
    @IsObject()
    @IsNotEmpty()
    country: AssignDto;

    @ValidateNested()
    @Typet(() => AssignDto)
    @IsObject()
    @IsNotEmpty()
    politicalDivision: AssignDto;

    @Length(0, 10)
    @IsString()
    @IsOptional()
    postalCode: string;

}
