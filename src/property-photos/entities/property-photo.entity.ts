import { Property } from 'src/properties/entities/property.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class PropertyPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mediaId: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isFavorite: boolean;

  @ManyToOne(() => Property)
  @JoinColumn()
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int' })
  ownerId: number;
}
