import { PolicyHistory } from 'src/policy-history/entities/policy-history.entity';
import { Property } from 'src/properties/entities/property.entity';
import { StatusPolicyNumber } from 'src/status-policy-number/entities/status-policy-number.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Policy {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ generated: 'increment', type: 'int' })
  lastNumber: number;

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

  @OneToMany(() => PolicyHistory, (PolicyHistory) => PolicyHistory.policy)
  policyHistories: PolicyHistory[];
}
