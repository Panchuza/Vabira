import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./type.entity";
import { User } from "./user.entity";

@Entity('UserStatus')
export class UserStatus {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number;

    @ManyToOne(() => User, (user) => user.userStatus)
    @JoinColumn({ name: 'User_Id' })
    user: User;

    @ManyToOne(() => Type)
    @JoinColumn({ name: 'UserStatus_Type_Id' })
    userStatusType: Type;

    @Column({ type: 'datetime', nullable: false, name: 'StatusRegistrationDateTime' })
    statusRegistrationDateTime: string;

    @Column({ type: 'datetime', nullable: true, name: 'DateTo' })
    dateTo: string;

    @BeforeInsert()
    insertRegistraionDate() {
        this.statusRegistrationDateTime = this.formatDate(new Date())
    }

    @BeforeUpdate()
    updateRegistraionDate() {
        this.statusRegistrationDateTime = this.formatDate(new Date())
    }
    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                this.padTo2Digits(date.getHours()),
                this.padTo2Digits(date.getMinutes()),
                this.padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }
}