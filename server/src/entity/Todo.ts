import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Todo {

	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column({ nullable: true })
	title: string;

	@Column({ nullable: true })
	order: number;

	@Column({ default: false })
	completed: boolean;

	@ManyToOne(type => User, user => user.todos)
	user: User;
}
