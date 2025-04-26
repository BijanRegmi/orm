import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm'
import { Order } from './Order.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: 'pk_user_id'
  })
  id: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column({ type: String })
  name: string

  @Column({ type: Number })
  age: number

  @Column({ type: String })
  password: string

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]
}
