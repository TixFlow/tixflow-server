import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

export enum TransactionStatus{
    Pending = 'pending',
    Paid = 'paid',
    Procesing = 'procesing',
    Cancelled = 'cancelled'
}

@Entity('transactions')
export class Transaction{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 255})
    paymentUrl: string;

    @Column({type: 'varchar', length: 255, unique: true})
    paymentLinkId: string;

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
        type: 'varchar',
        length: 36,
    })
    orderId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}