import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Turn } from "./turn.entity";
import { User } from "./user.entity";
import { SignStatus } from "./signStatus.entity";

@Entity('Sign')
export class Sign {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number

    @Column({ name: 'CreateDateTime', type: 'datetime', nullable: true })
    createDateTime: string;

    @Column({ name: 'InitialAmount', type: 'decimal', precision: 8, scale: 2, nullable: true })
    initialAmount: number

    @Column({ name: 'FinalAmount', type: 'decimal', precision: 8, scale: 2, nullable: true })
    finalAmount: number

    @OneToOne(() => Product, (product) => product.schedule)
    @JoinColumn({ name: 'Product_Id' })
    product: Product;

    @OneToOne(() => Turn, (turn) => turn.schedule)
    @JoinColumn({ name: 'Turn_Id' })
    turn: Turn

    @OneToOne(() => SignStatus, (signStatus) => signStatus.sign)
    signStatus: SignStatus[]

    @OneToOne(() => User, (user) => user.sign)
    @JoinColumn({ name: 'User_Id' })
    user: User;

}