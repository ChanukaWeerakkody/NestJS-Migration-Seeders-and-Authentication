import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entity/user.entity';
import { CreateUsersDto } from './dto/create-users.dto';
import { CustomException } from 'src/exception/custom.exception';
import { CustomLogger } from 'src/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: CustomLogger,
    private readonly datasource: DataSource,
  ) {}

  async checkUserExists(email: string,contact_number: string,): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { contact_number }],
    });
    return !!user;
  }


  async create(createUserDto: CreateUsersDto): Promise<any> {
    this.logger.log('Creating a new user...');
    const { email, contact_number } = createUserDto;
    try {
      const userExists = await this.checkUserExists(email, contact_number);
      if (userExists) {
        return new CustomException('User with the same email or contact number already exists');
      }

      // Hash the provided password from createUserDto
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Create a new user entity with the hashed password
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      return newUser;
    } catch (e) {
      console.log(e);
      throw new ConflictException("Failed to create user");
    }
  }

  async update(id: number,updateUserDto: Partial<CreateUsersDto>,): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_delete: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete updateUserDto.email; // Assuming email cannot be updated
    delete updateUserDto.password; // Password should be updated using a separate method

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ where: { is_delete: false } });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_delete: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async softDelete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.is_delete = true;
    await this.userRepository.save(user);
    return;
  }

  async findByPhoneNumber(contact_number: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { contact_number, is_delete: false },
    });
  }
}
