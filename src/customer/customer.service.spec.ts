import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerController } from './customer.controller';

describe('CustomerService', () => {
  let service: CustomerService;
  let controller: CustomerController;
  let repository: Repository<Customer>;

  const mockCustomer = new Customer();
  mockCustomer.id = '123';
  mockCustomer.name = 'John Doe';
  mockCustomer.cpf = '12345678900';
  mockCustomer.birthDate = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: createMock<Repository<Customer>>(),
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto = {
        name: 'John Doe',
        cpf: '12345678900',
        birthDate: new Date(),
      };
      jest.spyOn(repository, 'create').mockReturnValue(mockCustomer);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCustomer);

      const result = await service.create(createCustomerDto);

      expect(repository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(repository.save).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return a list of customers', async () => {
      const mockCustomers = [mockCustomer];
      const mockResponse = { data: mockCustomers, total: mockCustomers.length };
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockCustomers, mockCustomers.length]);

      const result = await service.findAll();

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer);

      const result = await service.findOne('123');

      expect(repository.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findByCpf', () => {
/*    it('should return an array of customers with matching CPF', async () => {

      const mockCustomers = [
        { id: '1', name: 'John', cpf: '111.111.111-11', birthDate: new Date() },
        { id: '2', name: 'Jane', cpf: '222.222.222-22', birthDate: new Date() },
        { id: '3', name: 'Bob', cpf: '333.333.333-33', birthDate: new Date() },
      ];
      jest.spyOn(service, 'findByCpf').mockResolvedValue(mockCustomers);
  
      const cpf = '111.111.111-11';
      const result = await controller.findByCpf(cpf);
  
      expect(result).toEqual(mockCustomers);
    });*/
  
    it('should throw a NotFoundException if no customers with matching CPF are found', async () => {
      const cpf = '999.999.999-99';
      jest.spyOn(service, 'findByCpf').mockResolvedValue([]);
  
      await expect(controller.findByCpf(cpf)).rejects.toThrow(NotFoundException);
    });
  });
  

  describe('update', () => {
    const mockUpdateCustomerDto = new UpdateCustomerDto();
    mockUpdateCustomerDto.name = 'John Doe Jr.';
    mockUpdateCustomerDto.cpf = '11111111111';
    mockUpdateCustomerDto.birthDate = new Date('1995-01-01');
  
    it('should update and return the updated customer', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockCustomer);
      const updatedCustomer = await controller.update('1', mockUpdateCustomerDto);
  
      expect(updatedCustomer).toEqual(mockCustomer);
      expect(service.update).toHaveBeenCalledWith('1', mockUpdateCustomerDto);
    });
  
    it('should throw a NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);
  
      await expect(controller.update('1', mockUpdateCustomerDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith('1', mockUpdateCustomerDto);
    });
  });
  
  describe('remove', () => {
    const id = 'abc123';
  
    it('should remove a customer successfully', async () => {
      const mockCustomer = new Customer();
      mockCustomer.id = id;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCustomer);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);
  
      const result = await service.remove(id);
      expect(result).toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(mockCustomer);
    });
  
    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
  
      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});