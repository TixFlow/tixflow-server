import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OrderPaymentMethod, OrderType } from "src/entities/order.entity";

export class CreateOrderRequestBody{
    @ApiProperty()
    @IsNotEmpty()
    ticketId: string;
    
    @ApiProperty({enum: OrderType, enumName: 'OrderType'})
    @IsNotEmpty()
    type: OrderType;

    @ApiProperty({enum: OrderPaymentMethod, enumName: 'OrderPaymentMethod'})
    @IsNotEmpty()
    paymentMethod: OrderPaymentMethod;

    @ApiProperty()
    @IsNotEmpty()
    totalAmount: number;
}