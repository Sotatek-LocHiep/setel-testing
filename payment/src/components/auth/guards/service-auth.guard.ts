import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

type DataRequest<T> = {
  data: T;
  trust_token: string;
};

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check authenticated request between services, but i not write it yet
    // const data: DataRequest<any> = context.switchToRpc().getData();
    // if(data.trust_token === 'trust_token_example') return true
    // return false
    return true;
  }
}
