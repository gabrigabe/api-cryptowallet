import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Wallets1642792981587 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(
            new Table({
                name: 'Wallets',
                columns: [
                    {
                        name: 'address',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                        isNullable: false,
                        isUnique: true
                    },

                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'cpf',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'birthdate',
                        type: 'varchar',
                        isNullable: false
                    },

                    {
                        name: 'createdAt',
                        type: 'Date',
                        default: 'now()',
                        isNullable: false
                    },
                    {
                        name: 'updatedAt',
                        type: 'Date',
                        default: 'now()',
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Wallets');
    }
}
