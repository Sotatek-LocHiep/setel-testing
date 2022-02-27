/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiResponseService } from './services/api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './services/hash/hash.service';

@Global()
@Module({
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService, HashService],
})
export class SharedModule {}
