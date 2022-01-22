import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Coins1642792981588 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(
            new Table({
                name: 'Coins',
                columns: [
                    {
                        name: 'id',
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
                        name: 'fullname',
                        type: 'varchar',
                        isNullable: false
                    },

                    {
                        name: 'amount',
                        type: 'numeric',
                        isNullable: false
                    },
                    {
                        name: 'address',
                        type: 'uuid',
                        isNullable: false
                    }
                ],
                foreignKeys: [
                    {
                        name: 'fk_wallets',
                        columnNames: ['address'],
                        referencedTableName: 'Wallets',
                        referencedColumnNames: ['address'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Coins');
    }
}
