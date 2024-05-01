import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity()
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    sku: string;

    @Column('int')
    price: number;

    @Column('uuid')
    productId: string;

    @ManyToOne(() => Product, (product) => product.variants)
    @JoinColumn({ name: 'productId' })
    product: Product;
}
