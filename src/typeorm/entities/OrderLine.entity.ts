import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Order } from './Order.entity'
import { ProductVariant } from './ProductVariant.entity'

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: 'pk_orderline_id'
  })
  id: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column({ type: Number })
  quantity: number

  @Column({ type: Number })
  unitPrice: number

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderLines
  )
  @JoinColumn({
    name: 'productVariantId',
    foreignKeyConstraintName: 'fk_orderline_productvariant'
  })
  productVariant: ProductVariant

  @Column({ type: Number })
  @Index('idx_orderline_productvariant_id')
  productVariantId: number

  @ManyToOne(() => Order, (order) => order.lines)
  @JoinColumn({
    name: 'orderId',
    foreignKeyConstraintName: 'fk_orderline_order'
  })
  order: Order

  @Column({ type: Number })
  @Index('idx_orderline_order_id')
  orderId: number
}
