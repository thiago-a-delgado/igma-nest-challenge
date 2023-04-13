import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Customer } from './customer/entities/customer.entity';
import { CustomerModule } from './customer/customer.module';

@Module({
  providers: [UserService, JwtService, CustomerModule, Repository<Customer>],
  exports: [UserService, JwtService, CustomerModule, Repository<Customer>],
  imports: [Repository<Customer>]
})
export class RootTestModule {}
