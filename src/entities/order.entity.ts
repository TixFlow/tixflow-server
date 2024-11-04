import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { Transaction } from "./transaction.entity";
import { User } from "./user.entity";

export enum OrderStatus{
    Pending = 'pending',
    Success = 'success',
    Failed = 'failed',
    Cancelled = 'cancelled'
}

export enum OrderPaymentMethod{
    VNPay = 'vnpay',
    Momot = 'momo',
}

export enum OrderType{
    UploadTicket = 'upload_ticket',
    BuyTicket = 'buy_ticket',
    Refund = 'refund',
    Return = 'return'
}

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: OrderType,
    })
    type: OrderType;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.Pending
    })
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: OrderPaymentMethod,
        default: OrderPaymentMethod.VNPay
    })
    paymentMethod: OrderPaymentMethod;

    @Column({
        type: 'float',
        default: 0
    })
    totalAmount: number;

    @Column({
        type: 'uuid',
        length: 36,
    })
    ticketId: string;

    @OneToMany(() => Ticket, ticket => ticket.orders)
    @JoinColumn({name: 'ticketId'})
    ticket: Ticket;

    @Column({
        type: 'uuid',
        length: 36,
    })
    userId: string;

    @OneToMany(() => Ticket, ticket => ticket.orders)
    @JoinColumn({name: 'userId'})
    user: User;

    @OneToOne(() => Transaction, transaction => transaction.order)
    transaction: Transaction;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}