import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Transactions1642792981589 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(
            new Table({
                name: 'Transactions',
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
                        name: 'value',
                        type: 'money',
                        isNullable: false
                    },
                    {
                        name: 'datetime',
                        type: 'date',
                        default: 'now()',
                        isNullable: false
                    },

                    {
                        name: 'sendto',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'receivefrom',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'coin_id',
                        type: 'uuid',
                        isNullable: false
                    }
                ],
                foreignKeys: [
                    {
                        name: 'fk_coin',
                        columnNames: ['coin_id'],
                        referencedTableName: 'Coins',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Transactions');
    }
}
