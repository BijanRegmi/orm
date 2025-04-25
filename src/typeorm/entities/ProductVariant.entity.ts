import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { OrderLine } from './OrderLine.entity'
import { Product } from './Product.entity'

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_productvariant_id'
  })
  id: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column({ type: String })
  name: string

  @Column({ type: String })
  description: string

  @Column({ type: String })
  sku: string

  @Column({ type: Number })
  price: number

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({
    name: 'productId',
    foreignKeyConstraintName: 'fk_productvariant_product'
  })
  product: Product

  @Column({ type: String })
  @Index('idx_productvariant_product_id')
  productId: string

  @OneToMany(() => OrderLine, (orderLine) => orderLine.productVariant)
  orderLines: OrderLine[]
}
