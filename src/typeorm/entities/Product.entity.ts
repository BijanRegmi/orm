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
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @Column()
  name: string

  @Column('text')
  description: string

  @Column()
  slug: string

  @OneToMany(() => ProductVariant, (productvariant) => productvariant.product)
  variants: ProductVariant[]
}
