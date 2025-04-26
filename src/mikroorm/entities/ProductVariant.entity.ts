import {
  BaseEntity,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { OrderLine } from './OrderLine.entity'
import { Product } from './Product.entity'

@Entity()
export class ProductVariant extends BaseEntity {
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

  @Property({ type: 'string', length: -1 })
  name!: string

  @Property({ type: 'string', length: -1 })
  description!: string

  @Property({ type: 'string', length: -1 })
  sku!: string

  @Property({ type: 'integer' })
  price!: number

  @Index({
    name: 'idx_productvariant_product_id',
    expression:
      'CREATE INDEX idx_productvariant_product_id ON public.product_variant USING btree ("productId")'
  })
  @ManyToOne({ entity: () => Product, fieldName: 'productId' })
  productId!: Product

  @OneToMany({ entity: () => OrderLine, mappedBy: 'productVariantId' })
  orderLineCollection = new Collection<OrderLine>(this)
}
