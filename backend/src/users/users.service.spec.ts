import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Church } from '../churches/church.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: 'u1', ...x })),
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    delete: jest.fn(() => Promise.resolve()),
  };

  const mockChurchRepo = {
    findOne: jest.fn(() => Promise.resolve({ id: 'c1' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Church), useValue: mockChurchRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a user and hashes password', async () => {
    const dto: any = { name: 'U', email: 'u@example.com', role: 'servant', password: 'secret' };
    const res = await service.create(dto);

    expect(mockUserRepo.create).toHaveBeenCalled();
    expect(mockUserRepo.save).toHaveBeenCalled();
    // Ensure passwordHash was set on saved entity
    const savedArg = mockUserRepo.save.mock.calls[0][0];
    expect(savedArg).toHaveProperty('passwordHash');
    expect(res).toHaveProperty('id');
  });
});
