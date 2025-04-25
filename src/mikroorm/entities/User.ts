import {
  Collection,
  Entity,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Order } from './Order.js'

@Entity()
export class User {
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

  @Property()
  age!: number

  @Property({ length: -1 })
  password!: string

  @OneToMany({ entity: () => Order, mappedBy: 'userId' })
  orderCollection = new Collection<Order>(this)
}
