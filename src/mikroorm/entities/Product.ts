import {
  Collection,
  Entity,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { ProductVariant } from './ProductVariant.js'

@Entity()
export class Product {
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
  slug!: string

  @OneToMany({ entity: () => ProductVariant, mappedBy: 'productId' })
  productVariantCollection = new Collection<ProductVariant>(this)
}
