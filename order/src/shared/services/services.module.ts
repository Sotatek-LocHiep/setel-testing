import { ApiResponseService } from './api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { microServicesProvide } from './micro-service/micro-services.provider';
@Global()
@Module({
  providers: [ApiResponseService, HashService, ...microServicesProvide],
  exports: [ApiResponseService, HashService, ...microServicesProvide],
  imports: [],
})
export class ServicesModule {}
