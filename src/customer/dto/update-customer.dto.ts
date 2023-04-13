import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';
  
/**
 * Definition of the information that will be transmitted in the edition of the customers requests
 * @class CreateCustomerDto
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  /**
   * Customer's name
   * @property name
   */
  @ApiProperty({ example: '1', description: 'Customer\'s ID.', type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}