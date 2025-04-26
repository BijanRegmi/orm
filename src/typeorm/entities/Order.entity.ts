import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { OrderLine } from './OrderLine.entity'
import { User } from './User.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: 'pk_order_id'
  })
  id: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column({ type: String })
  code: string

  @Column({ type: Number })
  total: number

  @Column({ type: Number })
  totalWithTax: number

  @Column({ type: Number })
  taxRate: number

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  lines: OrderLine[]

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'fk_order_user' })
  user: User

  @Column({ type: Number })
  @Index('idx_order_user_id')
  userId: number
}
