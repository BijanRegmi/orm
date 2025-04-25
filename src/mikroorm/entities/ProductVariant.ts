import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { OrderLine } from './OrderLine.js'
import { Product } from './Product.js'

@Entity()
export class ProductVariant {
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

  @Property({ length: -1 })
  name!: string

  @Property({ type: 'text' })
  description!: string

  @Property({ length: -1 })
  sku!: string

  @Property()
  price!: number

  @ManyToOne({ entity: () => Product, fieldName: 'productId' })
  productId!: Product

  @OneToMany({ entity: () => OrderLine, mappedBy: 'productvariantId' })
  orderLineCollection = new Collection<OrderLine>(this)
}
