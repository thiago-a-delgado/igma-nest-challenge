import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
//import { RootTestModule } from '../root-test.module';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //imports: [RootTestModule],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
