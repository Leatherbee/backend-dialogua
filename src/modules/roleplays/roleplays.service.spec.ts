import { Test, TestingModule } from '@nestjs/testing';
import { RoleplaysService } from './roleplays.service';

describe('RoleplaysService', () => {
  let service: RoleplaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleplaysService],
    }).compile();

    service = module.get<RoleplaysService>(RoleplaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
