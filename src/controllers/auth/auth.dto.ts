import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { User, UserGender } from "src/entities/user.entity";

export class SignInRequestBody{
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}

export class SignInResponseData{
    @ApiProperty()
    token: string;
}

export class SignUpRequestBody{
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

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    gender: UserGender;
}

export class SignUpResponseData{
    @ApiProperty()
    message: string;
}

export class VerifiedResponseData{
    @ApiProperty()
    user: User;
}