import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

export enum TransactionStatus{
    Pending = 'pending',
    Success = 'success',
    Failed = 'failed',
    Cancelled = 'cancelled'
}

@Entity('transactions')
export class Transaction{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.Pending
    })
    status: TransactionStatus;

    @Column({
        type: 'float',
        default: 0
    })
    totalAmount: number;

    @Column({
        type: 'uuid',
        length: 36,
    })
    orderId: string;

    @OneToOne(() => Order, order => order.transaction)
    @JoinColumn({name: 'orderId'})
    order: Order;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}