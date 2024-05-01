import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { Order } from "./Order.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column()
    name: string;

    @Column("int")
    age: number;

    @Column()
    password: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
