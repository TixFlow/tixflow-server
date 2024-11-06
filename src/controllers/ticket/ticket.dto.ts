import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTicketRequestBody{
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    location: string;
    @ApiProperty()
    @IsNotEmpty()
    code: string;
    @ApiProperty()
    @IsNotEmpty()
    expiryDate: Date;
    @ApiProperty()
    @IsNotEmpty()
    imageUrl: string;
    @ApiProperty()
    @IsNotEmpty()
    price: number;
    @ApiProperty()
    @IsNotEmpty()
    blogId: string;
}

export class UpdateTicketRequestBody{
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    location: string;
    @ApiProperty()
    code: string;
    @ApiProperty()
    expiryDate: Date;
    @ApiProperty()
    imageUrl: string;
    @ApiProperty()
    price: number;
}