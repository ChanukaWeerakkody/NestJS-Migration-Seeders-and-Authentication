import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires

dotenv.config({ path: '.env' });

export default new DataSource({
  type: 'mysql',
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "nestJsMigration",
  migrations: ['migration/**'],
  entities: [__dirname + 'src/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations_table',
});
