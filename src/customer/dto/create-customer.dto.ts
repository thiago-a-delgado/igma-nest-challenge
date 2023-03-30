import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Definition of information that will be transmitted about new customers in requests
 * @class CreateCustomerDto
 */
export class CreateCustomerDto {

  /**
   * Customer's name
   * @@property name
   */
  @ApiProperty({ example: 'Thiago Delgado', description: 'Customer\'s name.', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Customer's CPF, a brazilian national document
   * @property cpf
   */
  @ApiProperty({ example: '498.967.060-42', description: 'Number of brazilian identification - CPF.', type: String })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  /**
   * Customer's date of birth
   * @property birthDate
   */
  @ApiProperty({ example: '1998-04-20', description: 'Birth of date, in "yyyy-MM-dd format.', type: String  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;
}
