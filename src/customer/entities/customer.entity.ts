import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert } from "typeorm";

/**
 * Entity that represents a customer in the system.
 */
@Entity()
export class Customer extends BaseEntity {

  /**
   * Unique identifier of the customer
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Date when the customer was created
   */
  @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  /**
   * Date when the customer was last updated
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  /**
   * Name of the customer
   */
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  /**
   * CPF (Brazilian Document Registry) of the customer
   */
  @Column({ name: 'cpf', type: 'varchar', length: 11, unique: true })
  cpf: string;

  /**
   * Date of birth of the customer
   */
  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;
}
