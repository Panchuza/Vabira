import { IsDateString, IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    dni: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(6)
    @IsNotEmpty()
    password: string;

    @IsOptional()
    roles: string

    // @IsDateString()
    @IsOptional()
    dateOfBirth: string;


}
