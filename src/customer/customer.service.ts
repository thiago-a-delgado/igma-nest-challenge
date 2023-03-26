import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {

  constructor(@InjectRepository(Customer) private readonly repository: Repository<Customer>) { }

  async create(createCustomerDto: CreateCustomerDto): Promise <Customer> {
    // Checks if already exists a customer with the same CPF
    const existingCustomer = await this.repository.findOneBy({ cpf: createCustomerDto.cpf });
    if (existingCustomer) {
      throw new UnprocessableEntityException(`Customer with CPF '${createCustomerDto.cpf}' already exists.`);
    }

    const customer = this.repository.create(createCustomerDto);

    return this.repository.save(customer);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  findOne(id: string): Promise<Customer> {
    return this.repository.findOneBy({id: id});
  }

  async findByCpf(cpf: string): Promise<Customer[]> {
    const customers = this.repository.find({ where: { cpf: cpf } });
    if ((await customers).length === 0) {
      throw new NotFoundException(`Customer with CPF like '${cpf}' not found.`);
    }

    return customers;
  }

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

  async remove(id: string) {
    const customer = await this.findOne(id);
    return this.repository.remove(customer);
  }
}
