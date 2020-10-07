import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['userName'])

export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsEmail()
    @IsNotEmpty()
    userName: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    Password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    hashPassword(){
        const salt = bcrypt.genSaltSync(10);
        this.Password = bcrypt.hashSync(this.Password, salt);
    }

    checkPassword(password: string): Boolean {
        return bcrypt.compareSync(password, this.Password);
    }

}
