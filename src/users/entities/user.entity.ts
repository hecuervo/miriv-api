import { Profile } from 'src/profile/entities/profile.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Profile)
	@JoinColumn()
	profile: Profile

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Column({ type: 'varchar', length: 10, unique: true })
	mobile: string;

	@Column({ type: 'varchar' })
	password: string;

	@Column({ type: 'enum', enum: ['ADMIN', 'AGENTE', 'MIRIV', 'ARRENDADOR', 'FIADOR', 'ARRENDATARIO'], default: 'AGENTE' })
	role: string;

	@Column({ type: 'boolean', default: true })
	isActive: boolean;

	@Column({ type: 'timestamp', nullable: true })
	lastLogin: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ type: 'int', nullable: true })
	createdBy: number;

	@Column({ type: 'int', nullable: true })
	modifiedBy: number;
}
