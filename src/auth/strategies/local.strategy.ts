import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validateUser(mobile_number: string, password: string) {
    console.log('Inside LocalStrategy for Business Admin');
    const user = await this.authService.validateUser({ mobile_number, password });
    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return user;
  }

}
