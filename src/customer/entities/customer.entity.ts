import { 
  BaseEntity, 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
  CreateDateColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Entity that represents a customer in the system.
 */
@Entity( {name: 'customer'})
export class Customer extends BaseEntity {

  /**
   * Unique identifier of the customer
   */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  /**
   * Date when the customer was created
   */
  @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  @ApiProperty()
  createdAt: Date;

  /**
   * Date when the customer was last updated
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  @ApiProperty()
  updatedAt: Date;

  /**
   * Name of the customer
   */
  @Column({ name: 'name', type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  /**
   * CPF (Brazilian Document Registry) of the customer
   */
  @Column({ name: 'cpf', type: 'varchar', length: 11, unique: true })
  @ApiProperty()
  cpf: string;

  /**
   * Date of birth of the customer
   */
  @Column({ name: 'birth_date', type: 'date' })
  @ApiProperty()
  birthDate: Date;

  constructor(customer?: Partial<Customer>) {
    super();
    this.id = customer?.id;
    this.createdAt = customer?.createdAt;
    this.updatedAt = customer?.updatedAt;
    this.name = customer?.name;
    this.cpf = customer?.cpf;
    this.birthDate = customer?.birthDate;
  }
}
