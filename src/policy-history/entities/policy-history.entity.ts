import { Policy } from 'src/policy/entities/policy.entity';
import { StatusPolicyNumber } from 'src/status-policy-number/entities/status-policy-number.entity';
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
export class PolicyHistory {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => StatusPolicyNumber)
  @JoinColumn()
  status: StatusPolicyNumber;

  @ManyToOne(() => Policy)
  @JoinColumn()
  policy: Policy;

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
