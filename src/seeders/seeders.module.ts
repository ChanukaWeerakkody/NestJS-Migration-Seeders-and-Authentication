import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';


@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [SeedersService]
})
export class SeedersModule {}