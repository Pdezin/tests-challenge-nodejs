import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class UpdateStatementsType1658088079681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements", new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true
      }))

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        name: "FK_SenderUserId",
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      }))

      await queryRunner.changeColumn("statements", "type", new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw', 'transfer']
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn("statements", "type", new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      }))

      await queryRunner.dropForeignKey("statements", "FK_SenderUserId")

      await queryRunner.dropColumn("statements", "sender_id")
    }

}
