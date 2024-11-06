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