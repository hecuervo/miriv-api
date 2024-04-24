import { Property } from 'src/properties/entities/property.entity';
import { StatusPolicyNumber } from 'src/status-policy-number/entities/status-policy-number.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Policy {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ type: 'int', default: 0 })
  lastNumber: number = 0;

  @Column({ type: 'varchar', length: 255, unique: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Property)
  @JoinColumn()
  property: Property;

  @ManyToOne(() => User)
  @JoinColumn()
  tenant: User; // inquilino

  @ManyToOne(() => User)
  @JoinColumn()
  guarantor: User; // fiador

  @ManyToOne(() => User)
  @JoinColumn()
  estateAgent: User; // agente inmobiliario

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User; // propietario

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'int', default: 12 })
  validityTime: number;

  @ManyToOne(() => StatusPolicyNumber)
  status: StatusPolicyNumber;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

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

  @BeforeInsert()
  async generateNameBeforeInsert() {
    this.lastNumber += 1;
    this.name = `F-${this.lastNumber.toString().padStart(7, '0')}`;
    console.log(
      'before insert  - generateNameBeforeInsert - this.name:',
      this.name,
    );
  }
}
