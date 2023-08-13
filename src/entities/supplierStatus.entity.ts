import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "./supplier.entity";
import { Type } from "./type.entity";
import { User } from "./user.entity";

@Entity('SupplierStatus')
export class SupplierStatus {
    @PrimaryGeneratedColumn('increment', { name: 'Id' })
    id: number;

    @ManyToOne(() => Supplier, (supplier) => supplier.supplierStatus)
    @JoinColumn({ name: 'Supplier_Id' })
    supplier: Supplier;

    @OneToOne(() => Type)
    @JoinColumn({ name: 'SupplierStatus_Type_Id' })
    supplierStatusType: Type;

    @OneToOne(() => User, (user) => user.supplierStatus)
    @JoinColumn({ name: 'StatusRegistrationUser_Id' })
    statusRegistrationUser: User;

    @OneToOne(() => Type)
    @JoinColumn({ name: 'SupplierStatusReason_Type_Id' })
    supplierStatusReasonType: Type;

    @Column({ type: 'datetime', nullable: false, name: 'StatusRegistrationDateTime' })
    statusRegistrationDateTime: string;

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