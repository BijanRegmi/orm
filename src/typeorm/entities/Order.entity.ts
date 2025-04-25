import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { OrderLine } from './OrderLine.entity'
import { User } from './User.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column()
  code: string

  @Column('int')
  total: number

  @Column('int')
  totalWithTax: number

  @Column('int')
  taxRate: number

  @Column('uuid')
  userId: string

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  lines: OrderLine[]

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User
}
