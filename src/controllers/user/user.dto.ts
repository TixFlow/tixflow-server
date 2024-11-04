import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserGender, UserRole } from "src/entities";

export class CreateUserRequestBody{
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        enum: UserRole,
        enumName: 'UserRole'
    })
    role: UserRole

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    gender: UserGender;
}

export class UpdateUserRequestBody{
    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;
}