import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { ProductVariant } from './ProductVariant.entity'

@Entity()
export class Product extends BaseEntity {
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

  @Property({ type: 'string', length: -1 })
  name!: string

  @Property({ type: 'string', length: -1 })
  description!: string

  @Property({ type: 'string', length: -1 })
  slug!: string

  @OneToMany({ entity: () => ProductVariant, mappedBy: 'productId' })
  productVariantCollection = new Collection<ProductVariant>(this)
}
