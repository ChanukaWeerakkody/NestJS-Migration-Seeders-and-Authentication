import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Hello, World');
    // const response = context.switchToHttp().getResponse<Response>();
    // const request = context.switchToHttp().getResponse<Request>();
    // response.setHeader("role",request.user);
    return super.canActivate(context);
  }
}
