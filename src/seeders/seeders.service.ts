import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { DataSource } from 'typeorm';
import * as bcryptjs from "bcryptjs"

@Injectable()
export class SeedersService {
    queryRunner: any;
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {
        this.queryRunner = this.dataSource.createQueryRunner();
    }


    //user
    async runInitialUserSeed() {
        await this.queryRunner.manager.save(User,
            [
                {
                    email: "chanuka.weerakkody123@gmail.com",
                    contact_number: "0769475434",
                    name: "Chanuka Weerakkody",
                    password: bcryptjs.hashSync("12345", 5),
                },
            ]
        )
    }

    async seedTestData() {
        await this.runInitialUserSeed();
    }
}
