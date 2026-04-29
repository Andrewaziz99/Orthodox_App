import { Test, TestingModule } from '@nestjs/testing';
import { ChurchesService } from './churches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Church } from './church.entity';
import { User } from '../users/user.entity';

describe('ChurchesService', () => {
  let service: ChurchesService;
  const mockChurchRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: '1', ...x })),
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    delete: jest.fn(() => Promise.resolve()),
  };

  const mockUserRepo = {
    create: jest.fn((x) => x),
    save: jest.fn((x) => Promise.resolve({ id: 'u1', ...x })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChurchesService,
        { provide: getRepositoryToken(Church), useValue: mockChurchRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<ChurchesService>(ChurchesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a church and linked admin user when admin provided', async () => {
    const payload = {
      name: 'My Church',
      maxChildren: 20,
      admin: { name: 'Admin User', email: 'a@example.com', password: 'pass' },
    } as any;

    const res = await service.create(payload);

    expect(mockChurchRepo.create).toHaveBeenCalled();
    expect(mockChurchRepo.save).toHaveBeenCalled();
    expect(mockUserRepo.create).toHaveBeenCalled();
    expect(mockUserRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });
});
