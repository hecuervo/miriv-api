import { Property } from 'src/properties/entities/property.entity';
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
export class FileManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  fileType: string;

  @Column({ type: 'int', nullable: true })
  maxSize: number;

  @Column({ type: 'int', nullable: true })
  size: number;

  @Column({
    type: 'enum',
    enum: ['AGENTE', 'ARRENDADOR', 'PROPIEDAD', 'FIADOR', 'ARRENDATARIO'],
    nullable: true,
  })
  section: string;

  @Column({ type: 'boolean', default: true })
  isRequired: boolean;

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  folder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mediaId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  customer: User;

  @ManyToOne(() => Property)
  @JoinColumn()
  property: Property;

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
