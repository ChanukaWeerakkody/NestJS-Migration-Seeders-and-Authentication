import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entity/user.entity';
import { CreateUsersDto } from './dto/create-users.dto';
import { CustomException } from 'src/exception/custom.exception';
import { CustomLogger } from 'src/logger.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: CustomLogger,
    private readonly datasource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.logger.log(`Cache Store: ${(this.cacheManager.store as any).name || 'unknown'}`);
    this.logger.log(`Cache Client Status: ${(this.cacheManager as any).store?.client?.status || 'unknown'}`);
  }

  async checkUserExists(email: string, contact_number: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email }, { contact_number }],
    });
    return !!user;
  }

  async create(createUserDto: CreateUsersDto): Promise<User> {
    this.logger.log('Creating a new user...');
    const { email, contact_number } = createUserDto;

    try {
      const userExists = await this.checkUserExists(email, contact_number);
      if (userExists) {
        throw new CustomException('User with the same email or contact number already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Save user to database
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      // Save user to Redis Cloud
      await this.cacheManager.set(`user:${newUser.id}`, newUser, 3600000);

      this.logger.log(`User cached in Redis Cloud: user:${newUser.id}`);

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ConflictException('Failed to create user');
    }
  }

  async update(id: number, updateUserDto: Partial<CreateUsersDto>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_delete: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete updateUserDto.email; // Email cannot be updated
    delete updateUserDto.password; // Password should be updated separately

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Update cache
    await this.cacheManager.set(`user:${updatedUser.id}`, updatedUser, 3600000);
    this.logger.log(`User cache updated in Redis Cloud: user:${updatedUser.id}`);

    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { is_delete: false } });
  }

  async getUserById(id: number): Promise<User> {
    // Check cache first
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);
    if (cachedUser) {
      this.logger.log(`User retrieved from Redis Cloud: user:${id}`);
      return cachedUser;
    }

    const user = await this.userRepository.findOne({
      where: { id, is_delete: false },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Save to cache
    await this.cacheManager.set(`user:${id}`, user, 3600000);
    this.logger.log(`User cached in Redis Cloud: user:${id}`);

    return user;
  }

  async softDelete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.is_delete = true;
    await this.userRepository.save(user);

    // Remove from cache
    await this.cacheManager.del(`user:${id}`);
    this.logger.log(`User removed from Redis Cloud: user:${id}`);
  }

  async findByPhoneNumber(contact_number: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { contact_number, is_delete: false },
    });
  }
}
