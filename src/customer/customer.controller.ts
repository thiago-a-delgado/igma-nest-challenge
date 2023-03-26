import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnprocessableEntityException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsValidCpf} from '../helper/helper';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<{ data: Customer[]; total: number }> {
    return this.customerService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get('cpf/:cpf')
  @ApiProperty({ name: 'page', example: 2, description: 'Page number.', type: Number, default: 1 })
  @ApiProperty({ name: 'limit', example: 10, description: 'Record number per page', type: Number, default: 10 })
  async findByCpf(@Param('cpf') cpf: string): Promise<Customer[]> {
    if (!IsValidCpf(cpf)) {
      throw new UnprocessableEntityException(`Invalid CPF data or format: '${cpf}'.`);
    }
    return await this.customerService.findByCpf(cpf);
  }  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
