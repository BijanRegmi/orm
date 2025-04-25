import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  Ref
} from '@mikro-orm/core'
import { Order } from './Order'
import { ProductVariant } from './ProductVariant'

@Entity()
export class OrderLine {
  @PrimaryKey({ type: 'uuid', defaultRaw: `uuid_generate_v4()` })
  id!: string & Opt

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

  @Property()
  quantity!: number

  @Property({ fieldName: 'unitPrice' })
  unitPrice!: number

  @ManyToOne({ entity: () => Order, fieldName: 'orderId' })
  orderId!: Ref<Order>

  @ManyToOne({
    entity: () => ProductVariant,
    fieldName: 'productvariantId',
    nullable: true
  })
  productvariantId?: Ref<ProductVariant>
}
