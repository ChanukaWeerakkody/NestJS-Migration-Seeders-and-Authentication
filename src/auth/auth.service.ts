import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import {DataSource, In, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import {User} from "../entity/user.entity";

@Injectable()
export class AuthService {
 
  constructor(
      private jwtService: JwtService,
      @InjectRepository(User) private userRepository: Repository<User>,
      private readonly datasource:DataSource,

  ) {}

  async validateUser({mobile_number, password,}: AuthPayloadDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { contact_number: mobile_number },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('User password match: ' + passwordMatch);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      if (passwordMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          contact_number: user.contact_number,
        };

        const access_token = this.jwtService.sign(payload);
        return { access_token, payload };
      }

    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }
}
