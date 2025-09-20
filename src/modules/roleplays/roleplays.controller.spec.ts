import { Test, TestingModule } from '@nestjs/testing';
import { RoleplaysController } from './roleplays.controller';
import { RoleplaysService } from './roleplays.service';

describe('RoleplaysController', () => {
  let controller: RoleplaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleplaysController],
      providers: [RoleplaysService],
    }).compile();

    controller = module.get<RoleplaysController>(RoleplaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
