import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'timestamptz' })
  expirationDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

}
