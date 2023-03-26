import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'cpf', type: 'varchar', length: 11, unique: true })
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;
}
