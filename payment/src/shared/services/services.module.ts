import { ApiResponseService } from './api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './hash/hash.service';

@Global()
@Module({
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService],
})
export class ServicesModule {}
