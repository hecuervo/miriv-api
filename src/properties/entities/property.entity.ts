import { PropertyCategory } from 'src/property-categories/entities/property-category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  address: string;

  @ManyToOne(() => PropertyCategory)
  @JoinColumn()
  category: PropertyCategory;

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  latitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  longitude: string;

  @Column({ type: 'text', nullable: true })
  linkMap: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn()
  modifiedBy: User;
}
