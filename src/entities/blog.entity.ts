import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

export enum Category {
  Music = 'music',
  Sport = 'sport',
  Seminar = 'seminar',
  Culture = 'culture',
  Workshop = 'workshop',
}

export enum BlogStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Removed = 'removed',
}
@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: Category,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.Pending,
  })
  status: BlogStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.blog)
  tickets: Array<Ticket>;

  @Column({ type: 'uuid', length: 36 })
  userId: string;

  @ManyToOne(() => User, user => user.blogs)
  user: User;
}
