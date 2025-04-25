import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ProductVariant } from './ProductVariant.entity'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'pk_product_id' })
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
  slug: string

  @OneToMany(() => ProductVariant, (productvariant) => productvariant.product)
  variants: ProductVariant[]
}
