import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsValidCpf } from 'src/helper/helper';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

/**
 * Customer's service, responsible for providing customer's data
 * @class CreateCustomerDto
 */
@Injectable()
export class CustomerService {

  /**
   * Constructor, initialize values of members in class
   * @param repository
   */ 
  constructor(@InjectRepository(Customer) private readonly repository: Repository<Customer>) { }

  /**
   * Creates a new customer.
   * @param createCustomerDto - The DTO containing the data to create the customer.
   * @returns The newly created customer.
   * @throws UnprocessableEntityException if the cpf is duplicated or invalid.
   */
  async create(createCustomerDto: CreateCustomerDto): Promise <Customer> {
    const cpf = createCustomerDto.cpf;
    createCustomerDto.cpf = cpf.replace(/[^\d]+/g, '');
    // Checks if is a valid CPF number
    if (!this.validateCpf(cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${cpf}'.`);
    }        
    // Checks if already exists a customer with the same CPF
    const existingCustomer = await this.repository.findOneBy({ cpf: createCustomerDto.cpf });
    if (existingCustomer) {
      throw new UnprocessableEntityException(`Customer with CPF '${createCustomerDto.cpf}' already exists.`);
    }

    const customer = this.repository.create(createCustomerDto);

    return this.repository.save(customer);
  }

  /**
   * Retrieves all customers, paginated.
   * @param page - The displayed page number.
   * @param limit - The number of records displayed per page.
   * @returns The retrieved customers, paginated.
   */  
  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  /**
   * Retrieves some customer by ID.
   * @param id - The ID of the customer.
   * @returns The retrieved customer.
   * @throws NotFoundException if the customer's CPF is not found.
   */
  findOne(id: string): Promise<Customer> {
    return this.repository.findOneBy({id: id});
  }

  /**
   * Retrieves some customer by CPF.
   * @param cpf - The CPF of the customer.
   * @returns The retrieved customer.
   * @throws NotFoundException if the customer's CPF is not found.
   */
  async findByCpf(cpf: string): Promise<Customer[]> {
    const customers = this.repository.find({ where: { cpf: cpf } });
    if ((await customers).length === 0) {
      throw new NotFoundException(`Customer with CPF like '${cpf}' not found.`);
    }

    return customers;
  }

  /**
   * Updates an existing customer.
   * @param id - The ID of the customer to update.
   * @param updateCustomerDto - The DTO containing the updated data for the customer.
   * @returns The updated customer.
   * @throws NotFoundException if the customer ID is not found.
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer  = await this.repository.preload({
      id: id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found.`);
    }
    return this.repository.save(customer);
  }

  /**
   * Deletes an existing customer.
   * @param id - The ID of the customer to delete.
   * @returns The deleted customer. 
   * @throws NotFoundException if the customer ID is not found.
   */
  async remove(id: string) {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer #'${id}' not found.`);
    }    
    return this.repository.remove(customer);
  }

  /**
   * Checks if informed CPF is a valid number.
   * @param cpf - The number of the brazilian document.
   * @returns boolean.
   */
  validateCpf(cpf: string): boolean {
    return IsValidCpf(cpf);
  }  
}
