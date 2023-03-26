import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Thiago Delgado', description: 'Customer\'s name.', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '498.967.060-42', description: 'Number of brazilian identification - CPF.', type: String })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '1998-04-20', description: 'Birth of date, in "yyyy-MM-dd format.', type: String  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;
}
