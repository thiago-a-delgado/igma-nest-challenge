import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnprocessableEntityException, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsValidCpf} from '../helper/helper';

/**
 * Customer's controller, with methods for handling customer's requests
 * @class CreateCustomerDto
 */
@ApiTags('customer')
@Controller('customer')
export class CustomerController {

  /**
   * Constructor, initialize values of members in class
   * @param CustomerService
   */  
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Creates a new customer in the database
   * @param CreateCustomerDto
   * @returns A promise with the customer register
   */
  @Post()
  @ApiOperation({ description: 'Create a new customer' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  /**
   * Fetches the customers from the database
   * @param page Page number in pagination
   * @param limit Record number per page in pagination
   * @returns A promise with the list of customers and the amount of registers found
   */
  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    return this.customerService.findAll(page, limit);
  }

  /**
   * Fetches the unique customer from the database, identified by id informed
   * @param id An identifier of a customer. A customer with this id should exist in the database
   * @returns A promise with the customer register
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  /**
   * Fetches the list of customers from the database, identified by cpf informed
   * @param cpf An identifier of a brazilian person. A customer with this cpf should exist in the database
   * @returns A promise with the list of customers
   */
  @Get('cpf/:cpf')
  async findByCpf(@Param('cpf') cpf: string): Promise<Customer[]> {
    if (!IsValidCpf(cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${cpf}'.`);
    }
    return await this.customerService.findByCpf(cpf);
  }  

  /**
   * Updates the customer in the database, identified by id
   * @param id An identifier of a customer. A customer with this id should exist in the database
   * @returns A promise with the customer register
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const cpf = updateCustomerDto.cpf;
    if (!IsValidCpf(cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${cpf}'.`);
    }     
    updateCustomerDto.cpf = cpf.replace(/[^\d]+/g, '');
    return this.customerService.update(id, updateCustomerDto);
  }

  /**
   * Deletes a customer from the database
   * @param id An identifier of a customer. A customer with this id should exist in the database
   * @returns A promise with the customer register 
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Customer> {
    return this.customerService.remove(id);
  }
}
