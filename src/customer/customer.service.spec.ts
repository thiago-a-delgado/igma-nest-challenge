import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerController } from './customer.controller';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: Repository<Customer>;

  const customerList: Customer[] = [
    new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Delgado', birthDate: new Date('1988-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') }),
    new Customer({ id: '2', cpf: '12345678909', name: 'Marcos Cabrali', birthDate: new Date('1978-05-01'), createdAt: new Date('2023-02-01'), updatedAt: new Date('2023-03-01') }),
    new Customer({ id: '3', cpf: '04958499016', name: 'Renata Rochedo', birthDate: new Date('1989-07-03'), createdAt: new Date('2023-02-01'), updatedAt: new Date('2023-03-01') }),
  ];
  const customerLength: number = customerList.length;
  const customerPaginatedList = {data: customerList, total: customerLength};

  const newCustomer = new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Delgado', birthDate: new Date('1988-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') });
  const updatedCustomer = new Customer({ id: '1', cpf: '05478939650', name: 'Thiago Alterado', birthDate: new Date('2000-05-01'), createdAt: new Date('1988-01-01'), updatedAt: new Date('2023-03-01') });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            create: jest.fn().mockReturnValue(newCustomer),
            save: jest.fn().mockResolvedValue(newCustomer),
            find: jest.fn().mockResolvedValue(customerList[0]),
            findAndCount: jest.fn().mockResolvedValue([customerList, customerLength]),
            findOneBy: jest.fn().mockResolvedValue(customerList[0]),
            update: jest.fn().mockResolvedValue(updatedCustomer),
            preload: jest.fn().mockReturnValue(updatedCustomer),
            remove: jest.fn().mockResolvedValue(undefined)
          },      
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
    expect(customerRepository).toBeDefined();
  });  

  describe('create', () => {
    it('should create a new customer', async () => {
      // Arrange
      const createCustomerDto: CreateCustomerDto = {
        cpf: '05478939650',
        name: 'Thiago Delgado',
        birthDate: new Date('1988-05-01')
      };
      // Mocks an empty value to pass through the duplicate CPF test
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValueOnce(undefined);
  
      // Act
      const result = await customerService.create(createCustomerDto);
  
      // Assert
      expect(result).toEqual(newCustomer);
      expect(customerRepository.save).toHaveBeenCalledTimes(1);
      expect(customerRepository.create).toHaveBeenCalledTimes(1);
    });

    /* TODO: Uncomment this test.
    it('should throw UnprocessableEntityException when CPF already exists', async () => {
      // Arrange
      const existingCpf = '05478939650';
      const createDuplicateCustomerDto = {
        cpf: existingCpf,
        name: 'Thiago Delgado',
        birthDate: new Date('1988-05-01'),
      };
      jest.spyOn(customerRepository, 'save').mockRejectedValueOnce(new UnprocessableEntityException());
  
      // Act & Assert
      await expect(customerService.create(createDuplicateCustomerDto)).rejects.toThrow(UnprocessableEntityException);
    });*/
  });
  
  describe('findAll', () => {
    it('should return a paginated list of customers', async () => {
      // Act
      const result = await customerService.findAll();

      // Assert
      expect(result).toEqual(customerPaginatedList);
      expect(customerRepository.findAndCount).toHaveBeenCalledTimes(1);
      expect(customerRepository.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });

    it('should thrown an exception', () => {
      // Arrange
      jest.spyOn(customerRepository, 'findAndCount').mockRejectedValueOnce(new Error());

      // Assert
      expect(customerService.findAll).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a customer with specific ID', async () => {
      // Arrange
      const customerId = '1';
  
      // Act
      const result = await customerService.findOne(customerId);
  
      // Assert
      expect(result).toEqual(customerList[0]);
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ id: customerId });
    });

    it('should throw NotFoundException when customer is not found', async () => {
      // Arrange
      jest.spyOn(customerRepository, 'findOneBy').mockRejectedValueOnce(new NotFoundException());

      // Assert
      await expect(customerService.findOne('123')).rejects.toThrowError(NotFoundException);
    });
  });  

  describe('findByCpf', () => {
    it('should return a customer with specific CPF', async () => {

      // Arrange
      const customerCpf = '05478939650';
  
      // Act
      const result = await customerService.findByCpf(customerCpf);

      // Assert
      expect(result).toEqual(customerList[0]);
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ cpf: customerCpf });
    });

    it('should throw NotFoundException when customer is not found', async () => {
      // Arrange
      const customerCpf = '47742973057';
      const emptyCustomerList: Customer[] = [];

      jest.spyOn(customerRepository, 'find').mockResolvedValueOnce(emptyCustomerList);

      // Assert
      await expect(customerService.findByCpf(customerCpf)).rejects.toThrowError(NotFoundException);
    });

    it('should throw UnprocessableEntityException if CPF is a repeated digit', async () => {
      // Arrange
      const customerCpf = '99999999999';
      jest.spyOn(customerRepository, 'find').mockRejectedValueOnce(new UnprocessableEntityException());

      // Assert
      await expect(customerService.findByCpf(customerCpf)).rejects.toThrowError(UnprocessableEntityException);
      expect(customerRepository.find).toHaveBeenCalledWith({ where: { cpf: customerList[0].cpf } });
    });      
  
    it('should throw a UnprocessableEntityException if CPF is invalid', async () => {
      // Arrange
      const customerCpf = '12312312300';
      jest.spyOn(customerRepository, 'find').mockRejectedValueOnce(new UnprocessableEntityException());

      // Assert
      await expect(customerService.findByCpf(customerCpf)).rejects.toThrowError(UnprocessableEntityException);
      expect(customerRepository.find).toHaveBeenCalledWith({ where: {cpf: customerList[0].cpf} });
    });
  });
  
  describe('update', () => {  
    it('should update and return the updated customer', async () => {
      // Arrange
      const updateCustomerDto: UpdateCustomerDto = {
        id: '1',
        cpf: '05478939650', 
        name: 'Thiago Alterado', 
        birthDate: new Date('2000-05-01')
      };
      jest.spyOn(customerRepository, 'save').mockResolvedValueOnce(updatedCustomer);
      
      // Act
      const result = await customerService.update('1', updateCustomerDto);
  
      expect(result).toEqual(updatedCustomer);
      //expect(customerService.update).toHaveBeenCalledWith('1', updateCustomerDto);
    })
  
    it('should throw NotFoundException when customer is not found', async () => {
      // Arrange
      jest.spyOn(customerRepository, 'findOneBy').mockRejectedValueOnce(new NotFoundException());

      // Assert
      await expect(customerService.findOne('123')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    const id = 'abc123';
  
    it('should remove a customer successfully', async () => {
      // Arrange
      const customerList = new Customer();
      customerList.id = id;
      jest.spyOn(customerService, 'findOne').mockResolvedValue(customerList);
      jest.spyOn(customerRepository, 'remove').mockResolvedValue(undefined);
  
      // Act
      const result = await customerService.remove(id);

      // Assert
      expect(result).toBeUndefined();
      expect(customerRepository.remove).toHaveBeenCalledWith(customerList);
    });
  
    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(customerService, 'findOne').mockResolvedValue(undefined);
  
      await expect(customerService.remove(id)).rejects.toThrow(NotFoundException);
      expect(customerService.findOne).toHaveBeenCalledWith(id);
    });
  });
});