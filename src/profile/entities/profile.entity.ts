import { ConfigService } from '@nestjs/config';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  constructor(private configService: ConfigService) {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  secondLastname: string;

  @Column({ type: 'varchar', length: 18, unique: true, nullable: true })
  curp: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  rfc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessName: string;

  @Column({
    type: 'enum',
    enum: ['PERSONA FÍSICA', 'PERSONA MORAL'],
    nullable: true,
  })
  personType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @Column({
    type: 'enum',
    enum: ['FIADOR', 'OBLIGADO SOLIDARIO'],
    nullable: true,
  })
  typeGuarantor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  modifiedBy: number;
}
