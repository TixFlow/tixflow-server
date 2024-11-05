import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { Order } from './order.entity';

export enum TicketStatus {
  Sold = 'sold',
  Unverified = 'unverified',
  Verified = 'verified',
  Removed = 'removed',
  InProgress = 'in-progress',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  expiryDate: Date;

  @Column({ type: 'varchar', length: 50 })
  imageUrl: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.Unverified,
  })
  status: TicketStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', length: 36 })
  blogId: string;

  @ManyToOne(() => Blog, (blog) => blog.tickets)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @OneToMany(() => Order, (order) => order.ticket)
  orders: Array<Order>;
}
