import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Todo } from './Todo';

@Entity()
export class User {

	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column({ unique: true })
	@IsEmail()
	email: string;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ default: false })
	isAdmin: boolean;

	@OneToMany(type => Todo, todo => todo.user)
	todos: Todo[];

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;
}
