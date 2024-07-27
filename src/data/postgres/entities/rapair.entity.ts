import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


enum RepairStatus {
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELED',
}


@Entity()
export class Repair extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type:'date', nullable:false})
    date: Date;

    @Column({type:'int', nullable: false})
    motorsNumber: number;

    @Column({type: 'varchar', length: 200, nullable: false})
    description: string;

    @Column({type:'enum', enum: RepairStatus, default:RepairStatus.PENDING})
    status: string;
     
    // @Column({type:'int', nullable: false})
    // userId: number;

    @ManyToOne(() => User, (user) => user.repairs)
    user: User;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

}