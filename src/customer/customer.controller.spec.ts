import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  const customerList: Customer[] = [
    new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Delgado', birthDate: new Date('1988-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') }),
    new Customer({ id: '2', cpf: '12345678909', name: 'Marcos Cabrali', birthDate: new Date('1978-05-01'), createdAt: new Date('2023-02-01'), updatedAt: new Date('2023-03-01') }),
    new Customer({ id: '3', cpf: '04958499016', name: 'Renata Rochedo', birthDate: new Date('1989-07-03'), createdAt: new Date('2023-02-01'), updatedAt: new Date('2023-03-01') }),
  ];
  const newCustomer = new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Delgado', birthDate: new Date('1988-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') });
  const updatedCustomer = new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Alterado', birthDate: new Date('2000-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn().mockResolvedValue(newCustomer),
            findAll: jest.fn().mockResolvedValue(customerList),
            findOne: jest.fn().mockResolvedValue(customerList[0]),
            findByCpf: jest.fn().mockResolvedValue(customerList[1]),
            update: jest.fn().mockResolvedValue(updatedCustomer),
            remove: jest.fn().mockResolvedValue(undefined)
          }
        }
      ]
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
    expect(customerService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      // Arrange
      const body: CreateCustomerDto = {
        name: 'Michele Silva',
        cpf: '80466916078',
        birthDate: new Date('1978-12-31'),
      };

      // Act
      const result = await customerController.create(body);

      // Assert
      expect(result).toBe(newCustomer);
    });

    it('should throw an exception for invalid CPF', async () => {
      // Arrange
      const body: CreateCustomerDto = {
        name: 'Jonas Souza',
        cpf: '80466916075',
        birthDate: new Date('1999-01-20'),
      };
      jest.spyOn(customerService, 'create').mockRejectedValueOnce(new UnprocessableEntityException());

      // Act
      const result = customerController.create(body);

      // Assert
      expect(result).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe('findAll', () => {
    it('should return a list of customers', async () => {
      // Act
      const result = await customerController.findAll();

      // Assert
      expect(result).toEqual(customerList);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest.spyOn(customerService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(customerController.findAll()).rejects.toThrowError();
    });    
  });

  describe('findOne', () => {
    it('should return a customer with specific ID', async () => {
      // Act
      const result = await customerController.findOne(customerList[0].id);

      // Assert
      expect(result).toEqual(customerList[0]);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest.spyOn(customerService, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(customerController.findOne('1')).rejects.toThrowError();
    });      
  });

  describe('findByCpf', () => {
    it('should return a customer with specific CPF', async () => {
      // Act
      const result = await customerController.findByCpf(customerList[1].cpf);

      // Assert
      expect(result).toEqual(customerList[1]);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest.spyOn(customerService, 'findByCpf').mockRejectedValueOnce(new UnprocessableEntityException());

      // Assert
      expect(customerController.findByCpf('05478939651')).rejects.toThrowError(UnprocessableEntityException);
    });      
  });

  describe('update', () => {
    it('should return an updated customer', async () => {
      // Arrange
      const body: UpdateCustomerDto = {
        name: 'Thiago Alterado',
        cpf: '05478939650',
        birthDate: new Date('2000-05-01'),
      };

      // Act
      const result = await customerController.update('1', body);

      // Assert
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw an exception', async () => {
      // Arrange
      const body: UpdateCustomerDto = {
        name: 'Thiago Alterado',
        cpf: '05478939650',
        birthDate: new Date('2000-05-01'),
      };      
      jest.spyOn(customerService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(customerController.update('1', body)).rejects.toThrowError();
    });      
  });
  
  describe('remove', () => {
    it('should remove a customer', async () => {
      // Act
      const result = await customerController.remove('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', async () => {
      // Arrange
      jest.spyOn(customerService, 'remove').mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(customerController.remove('9999')).rejects.toThrowError(NotFoundException);
    });      
  });  
});