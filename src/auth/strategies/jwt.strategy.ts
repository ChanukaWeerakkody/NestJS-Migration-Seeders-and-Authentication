import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    /*super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      /!*secretOrKey: 'abc123',*!/
      secretOrKey: process.env.JWT_SECRET,
    });*/

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc123', // Using a default value if JWT_SECRET is undefined
    });
  }



  validate(payload: any) {
    console.log('Inside JWT Strategy Validate');
    console.log(payload);
    return payload;
  }
}
