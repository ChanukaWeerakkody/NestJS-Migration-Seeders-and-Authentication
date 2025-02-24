import {Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import { Request } from "express";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtAuthGuard} from "./guard/jwt.guard";
import { AuthService } from "./auth.service";

@Controller('auth/v1')
export class AuthController {
  constructor(private readonly localStrategy: LocalStrategy, private readonly authService:AuthService) {}

  @Post('user/login')
  @UseGuards(LocalStrategy)
  async userLogin(@Req() req: Request) {
    const { mobile_number, password } = req.body;
    console.log(mobile_number);
    try {
      const user = await this.localStrategy.validateUser(mobile_number, password);
      return user;

    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

}
