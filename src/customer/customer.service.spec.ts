import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  /*describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [
        {
          "id": "adc9327a-8b5a-4c70-96fc-042dd250d978",
          "updatedAt": "2023-03-26T22:30:22.072Z",
          "name": "Thiago Delgado",
          "cpf": "05478939650",
          "birthDate": new Date("1998-04-20")
        },
        {
          "id": "cc0503a8-e490-4646-999a-b90fd51cdc2b",
          "updatedAt": "2023-03-26T22:30:48.112Z",
          "name": "Marcos Delgado",
          "cpf": "03616523648",
          "birthDate": new Date("1998-04-20")
        }];
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([customers, customers.length]);

      expect(result.data).toEqual(customers);
      expect(result.total).toEqual(customers.length);
    });
  });*/
});
