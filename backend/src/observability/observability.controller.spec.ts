import { Test, TestingModule } from '@nestjs/testing';
import { ObservabilityController } from './observability.controller';

describe('ObservabilityController', () => {
  let controller: ObservabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObservabilityController],
    }).compile();

    controller = module.get<ObservabilityController>(ObservabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
