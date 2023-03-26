import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
  
/**
 * @ignore 
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
