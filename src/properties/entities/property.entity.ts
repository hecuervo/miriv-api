import { FileManagement } from 'src/file-management/entities/file-management.entity';
import { Policy } from 'src/policy/entities/policy.entity';
import { PropertyCategory } from 'src/property-categories/entities/property-category.entity';
import { PropertyPhoto } from 'src/property-photos/entities/property-photo.entity';
import { Sepomex } from 'src/sepomex/entities/sepomex.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  numberInt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  numberExt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImage: string;

  @ManyToOne(() => Sepomex)
  @JoinColumn()
  sepomex: Sepomex;

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

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isGuarantee: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

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

  @OneToMany(() => FileManagement, (file) => file.property)
  files: FileManagement[];

  @OneToMany(() => PropertyPhoto, (photo) => photo.property)
  photos: PropertyPhoto[];

  @OneToOne(() => Policy, (policy) => policy.property)
  policy: Policy;
}
