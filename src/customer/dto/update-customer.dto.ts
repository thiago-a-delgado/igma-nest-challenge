import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
  
/**
 * Definition of the information that will be transmitted in the edition of the customers requests
 * @class CreateCustomerDto
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
