import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { OrderPaymentMethod } from 'src/entities/order.entity';

export class CreatePaymentUrlBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  paymentLinkId: string;

  @ApiProperty()
  @IsNotEmpty()
  paymentUrl: string;
}
