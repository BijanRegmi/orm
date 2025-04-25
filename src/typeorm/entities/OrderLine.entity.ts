import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ProductVariant } from './ProductVariant.entity'
import { Order } from './Order.entity'

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column('int')
  quantity: number

  @Column('int')
  unitPrice: number

  @Column('uuid')
  orderId: string

  @ManyToOne(() => ProductVariant)
  productvariant: ProductVariant

  @ManyToOne(() => Order, (order) => order.lines)
  @JoinColumn({ name: 'orderId' })
  order: Order
}
