import { Profile } from 'src/profile/entities/profile.entity';
import { Property } from 'src/properties/entities/property.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  mobile: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'AGENTE', 'MIRIV', 'ARRENDADOR', 'FIADOR', 'ARRENDATARIO'],
    default: 'AGENTE',
  })
  role: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn()
  modifiedBy: User;

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];
}
