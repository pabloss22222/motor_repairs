import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


enum UserStatus {
    AVAILABLE ='AVAILABLE',
    DISABLED = 'DISABLED'
}

enum UserRole {
    CLIENT= 'CLIENT',
    EMPLOYEE= 'EMPLOYEE'
}

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 130, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 130, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;

    @Column({type: 'enum', enum: UserRole, default:UserRole.CLIENT})
    role: string;

    @Column({type:'enum', enum: UserStatus, default:UserStatus.AVAILABLE})
    status: string;

    @Column({type: "boolean", default: false})
    emailValidated: boolean

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

}