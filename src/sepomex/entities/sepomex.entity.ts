import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sepomex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_codigo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_asenta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_tipo_asenta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_mnpio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_estado: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_ciudad: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_CP: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_estado: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_oficina: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_CP: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_tipo_asenta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_mnpio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  id_asenta_cpcons: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  d_zona: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  c_cve_ciudad: string;
}
