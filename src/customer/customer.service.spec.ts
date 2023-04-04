import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

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
            save: jest.fn().mockResolvedValue(newCustomer),
            findAndCount: jest.fn().mockResolvedValue([customerList, customerLength]),
            findOneBy: jest.fn().mockResolvedValue(customerList[1]),
            update: jest.fn().mockResolvedValue(updatedCustomer),
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
        cpf: '09969545035',
        name: 'Eugenia Campos',
        birthDate: new Date('1988-05-01'),
      };
  
      // Act
      const result = await customerService.create(createCustomerDto);
  
      // Assert
      expect(result).toEqual(newCustomer);
      expect(customerRepository.save).toHaveBeenCalledWith(newCustomer);
      expect(customerRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw UnprocessableEntityException when CPF already exists', async () => {
      // Arrange
      const existingCpf = '05478939650';
      const createCustomerDto = {
        cpf: existingCpf,
        name: 'Thiago Delgado',
        birthDate: new Date('1988-05-01'),
      };
      jest.spyOn(customerRepository, 'save').mockRejectedValueOnce(new UnprocessableEntityException());
  
      // Act & Assert
      await expect(customerService.create(createCustomerDto)).rejects.toThrow(UnprocessableEntityException);
    });  
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
    it('should return a customer by ID', async () => {
      // Arrange
      const customerId = '1';
  
      // Act
      const result = await customerService.findOne(customerId);
  
      // Assert
      expect(result).toEqual(customerList[1]);
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ id: customerId });
    });

    it('should throw NotFoundException when customer is not found', async () => {
      // Arrange
      jest.spyOn(customerRepository, 'findOneBy').mockRejectedValueOnce(new NotFoundException());

      // Assert
      await expect(customerService.findOne('123')).rejects.toThrowError(NotFoundException);
    });    
  });  

  /*
  describe('findByCpf', () => {
    it('should return an array of customers with matching CPF', async () => {

      const mockCustomers = [
        { id: '1', name: 'John', cpf: '111.111.111-11', birthDate: new Date() },
        { id: '2', name: 'Jane', cpf: '222.222.222-22', birthDate: new Date() },
        { id: '3', name: 'Bob', cpf: '333.333.333-33', birthDate: new Date() },
      ];
      jest.spyOn(customerService, 'findByCpf').mockResolvedValue(mockCustomers);
  
      const cpf = '111.111.111-11';
      const result = await controller.findByCpf(cpf);
  
      expect(result).toEqual(mockCustomers);
    });
  
    it('should throw a NotFoundException if no customers with matching CPF are found', async () => {
      const cpf = '999.999.999-99';
      jest.spyOn(customerService, 'findByCpf').mockResolvedValue([]);
  
      await expect(controller.findByCpf(cpf)).rejects.toThrow(NotFoundException);
    });
  });
  

  describe('update', () => {
    const mockUpdateCustomerDto = new UpdateCustomerDto();
    mockUpdateCustomerDto.name = 'John Doe Jr.';
    mockUpdateCustomerDto.cpf = '11111111111';
    mockUpdateCustomerDto.birthDate = new Date('1995-01-01');
  
    it('should update and return the updated customer', async () => {
      jest.spyOn(customerService, 'update').mockResolvedValue(customerList);
      const updatedCustomer = await controller.update('1', mockUpdateCustomerDto);
  
      expect(updatedCustomer).toEqual(customerList);
      expect(customerService.update).toHaveBeenCalledWith('1', mockUpdateCustomerDto);
    });
  
    it('should throw a NotFoundException if customer is not found', async () => {
      jest.spyOn(customerService, 'update').mockResolvedValue(null);
  
      await expect(controller.update('1', mockUpdateCustomerDto)).rejects.toThrow(NotFoundException);
      expect(customerService.update).toHaveBeenCalledWith('1', mockUpdateCustomerDto);
    });
  });
  
  describe('remove', () => {
    const id = 'abc123';
  
    it('should remove a customer successfully', async () => {
      const customerList = new Customer();
      customerList.id = id;
      jest.spyOn(customerService, 'findOne').mockResolvedValue(customerList);
      jest.spyOn(customerRepository, 'remove').mockResolvedValue(undefined);
  
      const result = await customerService.remove(id);
      expect(result).toBeUndefined();
      expect(customerRepository.remove).toHaveBeenCalledWith(customerList);
    });
  
    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(customerService, 'findOne').mockResolvedValue(undefined);
  
      await expect(customerService.remove(id)).rejects.toThrow(NotFoundException);
      expect(customerService.findOne).toHaveBeenCalledWith(id);
    });
  });*/
});