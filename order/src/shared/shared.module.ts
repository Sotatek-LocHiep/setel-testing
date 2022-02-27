/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiResponseService } from './services/api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './services/hash/hash.service';
import { microServicesProvide } from './services/micro-service/micro-services.provider';

@Global()
@Module({
  providers: [ApiResponseService, HashService, ...microServicesProvide],
  exports: [ApiResponseService, HashService, ...microServicesProvide],
})
export class SharedModule {}
