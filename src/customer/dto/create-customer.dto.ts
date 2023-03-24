import { IsNotEmpty, IsString, IsDate, MaxDate } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsDate()
  @IsNotEmpty()
  @MaxDate(new Date(), {
    message: 'A data de nascimento não pode ser maior que a data atual.',
  })
  birth_date: Date;
}
