import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';


@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  private async handleServiceError<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to perform operation');
    }
  }

   @Post()
  async createUser(@Body() createUserDto: CreateUsersDto): Promise<any> {
    console.log("save user")
    return await this.userService.create(createUserDto);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUsersDto>,
  ): Promise<User> {
    return await this.handleServiceError(() => this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  async softDeleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.handleServiceError(() => this.userService.softDelete(id));
  }

  @Get('allUsers')
  async getAllUsers(): Promise<User[]> {
    return await this.handleServiceError(() => this.userService.getAllUsers());
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.handleServiceError(() => this.userService.getUserById(id));
  }
}
