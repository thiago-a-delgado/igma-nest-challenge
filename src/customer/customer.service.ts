import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
   * @param customerRepository
   */ 
  constructor(
    @InjectRepository(Customer) 
    private readonly customerRepository: Repository<Customer>
  ) { }

  /**
   * Creates a new customer.
   * @param createCustomerDto - The DTO containing the data to create the customer.
   * @returns The newly created customer.
   * @throws UnprocessableEntityException if the cpf is duplicated or invalid.
   */
  async create(createCustomerDto: CreateCustomerDto): Promise <Customer> {
    // Checks if is a valid CPF number
    if (!this.isValidCpf(createCustomerDto.cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${createCustomerDto.cpf}'.`);
    }        
    // Checks if already exists a customer with the same CPF
    const existingCustomer = await this.customerRepository.findOneBy({ cpf: createCustomerDto.cpf });
    if (existingCustomer) {
      throw new UnprocessableEntityException(`Customer with CPF '${createCustomerDto.cpf}' already exists.`);
    }

    createCustomerDto.cpf = createCustomerDto.cpf?.replace(/[^\d]+/g, '');

    const customer = this.customerRepository.create(createCustomerDto);

    return this.customerRepository.save(customer);
  }

  /**
   * Retrieves all customers, paginated.
   * @param page - The displayed page number.
   * @param limit - The number of records displayed per page.
   * @returns The retrieved customers, paginated.
   */  
  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    const [data, total] = await this.customerRepository.findAndCount({
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
    return this.customerRepository.findOneBy({id: id});
  }

  /**
   * Retrieves some customer by CPF.
   * @param cpf - The CPF of the customer.
   * @returns The retrieved customer.
   * @throws NotFoundException if the customer's CPF is not found.
   */
  async findByCpf(cpf: string): Promise<Customer[]> {
    // Checks if is a valid CPF number
    if (!this.isValidCpf(cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${cpf}'.`);
    }      
    const customers = this.customerRepository.find({ where: { cpf: cpf } });
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
    // Checks if is a valid CPF number
    if (!this.isValidCpf(updateCustomerDto.cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${updateCustomerDto.cpf}'.`);
    }      
    const customer  = await this.customerRepository.preload({
      id: id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found.`);
    }
    return this.customerRepository.save(customer);
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
    return this.customerRepository.remove(customer);
  }

  /**
   * Checks if the CPF entered is a valid number, according to the rules implemented by the RFB
   * @param cpf A identifier of a brazilian citizen. This number is unique for each brazilian person.
   * @returns boolean True or false
   */
  isValidCpf(cpf: string): boolean {

    // Checks if cpf is defined
    if (!cpf) {
      return false;
    }

    // Checks the CPF length, which must be: 
    // 11 characters without mask or 14 characters with mask
    if (!cpf || cpf.length !== 11 && cpf.length !== 14) {
      return false;
    }

    // Removing mask
    cpf = cpf.replace(/[^\d]+/g, '');

    // Checks if the informed CPF does not have all the same characters 
    if (cpf.length !== 11 || !Array.from(cpf).filter(e => e !== cpf[0]).length) {
      return false;
    }

    let sum = 0;
    let rest = 0;

    // Multiplies each of the first 9 digits of the CPF, 
    // from right to left by increasing numbers starting from number 2
    for (var i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    // Divides the result obtained by 11, considering only the integer value.
    rest = (sum * 10) % 11;

    // If the rest of the division is less than 2, then the digit is equal to 0.
    if ((rest == 10) || (rest == 11)){
      rest = 0;
    }

    // Checks if the first digit is corret
    if (rest != parseInt(cpf.substring(9, 10))) {
      return false;
    }

    // Same calculation, but now to the second digit
    // Multiplies each of the first 10 digits of the CPF, 
    // from right to left by increasing numbers starting from number 2  
    sum = 0;
    for (var i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    // Divides the result obtained by 11, considering only the integer value.
    rest = (sum * 10) % 11;

    // If the rest of the division is less than 2, then the digit is equal to 0.
    if ((rest == 10) || (rest == 11)) {
      rest = 0;
    }

    // Checks if the second digit is corret
    if (rest != parseInt(cpf.substring(10, 11))) {
      return false;
    }
    
    return true;
  }
}
