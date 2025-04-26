import {
  BaseEntity,
  Entity,
  Index,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Order } from './Order.entity'
import { ProductVariant } from './ProductVariant.entity'

@Entity()
export class OrderLine extends BaseEntity {
  @PrimaryKey({ type: 'integer' })
  id!: number

  @Property({
    fieldName: 'createdAt',
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `now()`
  })
  createdAt!: Date & Opt

  @Property({
    fieldName: 'updatedAt',
    type: 'datetime',
    columnType: 'timestamp(6)',
    defaultRaw: `now()`
  })
  updatedAt!: Date & Opt

  @Property({ type: 'integer' })
  quantity!: number

  @Property({ fieldName: 'unitPrice', type: 'integer' })
  unitPrice!: number

  @Index({
    name: 'idx_orderline_productvariant_id',
    expression:
      'CREATE INDEX idx_orderline_productvariant_id ON public.order_line USING btree ("productVariantId")'
  })
  @ManyToOne({ entity: () => ProductVariant, fieldName: 'productVariantId' })
  productVariantId!: ProductVariant

  @Index({
    name: 'idx_orderline_order_id',
    expression:
      'CREATE INDEX idx_orderline_order_id ON public.order_line USING btree ("orderId")'
  })
  @ManyToOne({ entity: () => Order, fieldName: 'orderId' })
  orderId!: Order
}
