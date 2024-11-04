import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Blog } from "./blog.entity";
import { Category } from "./category.entity";
import { Order } from "./order.entity";

export enum TicketStatus{
    Unpaid = 'unpaid',
    Paid = 'paid',
    Unverified = 'unverified',
    Verified = 'verified',
    Removed = 'removed',
    InProgress = 'in-progress',
}

@Entity('tickets')
export class Ticket{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50})
    title: string;
    
    @Column({type: 'text'})
    description: string;

    @Column({type: 'varchar', length: 50})
    imageUrl: string;

    @Column({type:'number', default: 0})
    price: number;

    @Column({
        type: 'enum', 
        enum: TicketStatus, 
        default: TicketStatus.Unpaid
    })
    status: TicketStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: 'uuid', length: 36})
    userId: string;

    @ManyToOne(() => User, user => user.tickets)
    @JoinColumn({name: 'userId'})
    user: User

    @Column({type: 'uuid', length: 36})
    blogId: string;

    @ManyToOne(() => Blog, blog => blog.tickets)
    @JoinColumn({name: 'blogId'})
    blog: Blog;

    @Column({type: 'uuid', length: 36})
    categoryId: string;

    @ManyToOne(() => Category, category => category.tickets)
    @JoinColumn({name: 'categoryId'})
    category: Category;

    @OneToMany(() => Order, order => order.ticket)
    orders: Array<Order>
}