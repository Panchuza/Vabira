import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToOne(() => Turn, (turn) => turn.schedule)
    @JoinColumn({ name: 'Turn_Id' })
    turn: Turn

    @OneToMany(() => SignStatus, (signStatus) => signStatus.sign, {cascade: true})
    signStatus: SignStatus[]

    @OneToOne(() => User, (user) => user.sign)
    @JoinColumn({ name: 'User_Id' })
    user: User;

}