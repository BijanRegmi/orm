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
import { User } from './User.js'
import { Ref } from '@mikro-orm/core'

@Entity()
export class Order {
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
  code!: string

  @Property()
  total!: number

  @Property({ fieldName: 'totalWithTax' })
  totalWithTax!: number

  @Property({ fieldName: 'taxRate' })
  taxRate!: number

  @ManyToOne({ entity: () => User, fieldName: 'userId' })
  userId!: Ref<User>

  @OneToMany({ entity: () => OrderLine, mappedBy: 'orderId' })
  orderLineCollection = new Collection<OrderLine>(this)
}
