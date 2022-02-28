import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../../../../test/test.module';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { ProductService } from '../services/product.service';
import { ProductController } from './product.controller';

describe('Product Controller', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [ApiResponseService, ProductService],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
