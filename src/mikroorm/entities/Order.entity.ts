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
import { User } from './User.entity'

@Entity()
export class Order extends BaseEntity {
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
  code!: string

  @Property({ type: 'integer' })
  total!: number

  @Property({ fieldName: 'totalWithTax', type: 'integer' })
  totalWithTax!: number

  @Property({ fieldName: 'taxRate', type: 'integer' })
  taxRate!: number

  @Index({
    name: 'idx_order_user_id',
    expression:
      'CREATE INDEX idx_order_user_id ON public."order" USING btree ("userId")'
  })
  @ManyToOne({ entity: () => User, fieldName: 'userId' })
  userId!: User

  @OneToMany({ entity: () => OrderLine, mappedBy: 'orderId' })
  orderLineCollection = new Collection<OrderLine>(this)
}
