import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePayOsUrlBody{
    @ApiProperty()
    @IsNotEmpty()
    orderId: string

    @ApiProperty()
    @IsNotEmpty()
    amount: number
}