import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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

    @Column({type:'enum', enum: RepairStatus, default:RepairStatus.PENDING})
    status: string;

    @Column({type:'int', nullable: false})
    userId: number;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

}