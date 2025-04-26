import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Order } from './Order.entity'

@Entity()
export class User extends BaseEntity {
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

  @Property({ type: 'integer' })
  age!: number

  @Property({ type: 'string', length: -1 })
  password!: string

  @OneToMany({ entity: () => Order, mappedBy: 'userId' })
  orderCollection = new Collection<Order>(this)
}
