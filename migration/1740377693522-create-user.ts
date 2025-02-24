import { MigrationInterface, QueryRunner,Table } from "typeorm";

export class CreateUser1740377693522 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'user',
            columns: [
              {
                name: 'id',
                type: 'int', 
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'email',
                type: 'varchar',
                isUnique: true, 
                isNullable:true, 
              },
              {
                name: 'contact_number',
                type: 'varchar', 
              },
              {
                name: 'name',
                type: 'varchar',
              },
              {
                name: 'password',
                type: 'varchar',
                isNullable:true, 
              },
              {
                name: 'is_delete', 
                type: 'boolean',
                default: false,
              },
            ],
          }),
          true, // Check if table already exists before creating
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
      }

}
