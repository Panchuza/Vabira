import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    dni: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    roles: string

    // @IsDateString()
    @IsOptional()
    dateOfBirth: string;


}
