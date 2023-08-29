import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategory1693275279084 implements MigrationInterface {
    name = 'AddCategory1693275279084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "price_subunit" integer NOT NULL, "price_currency" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "encrypted_password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "category_products_product" ("category_id" integer NOT NULL, "product_id" integer NOT NULL, PRIMARY KEY ("category_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d7c51e7e113812de685d88df3" ON "category_products_product" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3071808e19df360b703fc6ee1d" ON "category_products_product" ("product_id") `);
        await queryRunner.query(`DROP INDEX "IDX_8d7c51e7e113812de685d88df3"`);
        await queryRunner.query(`DROP INDEX "IDX_3071808e19df360b703fc6ee1d"`);
        await queryRunner.query(`CREATE TABLE "temporary_category_products_product" ("category_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "FK_8d7c51e7e113812de685d88df3b" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_3071808e19df360b703fc6ee1d4" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("category_id", "product_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_category_products_product"("category_id", "product_id") SELECT "category_id", "product_id" FROM "category_products_product"`);
        await queryRunner.query(`DROP TABLE "category_products_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_category_products_product" RENAME TO "category_products_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_8d7c51e7e113812de685d88df3" ON "category_products_product" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3071808e19df360b703fc6ee1d" ON "category_products_product" ("product_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_3071808e19df360b703fc6ee1d"`);
        await queryRunner.query(`DROP INDEX "IDX_8d7c51e7e113812de685d88df3"`);
        await queryRunner.query(`ALTER TABLE "category_products_product" RENAME TO "temporary_category_products_product"`);
        await queryRunner.query(`CREATE TABLE "category_products_product" ("category_id" integer NOT NULL, "product_id" integer NOT NULL, PRIMARY KEY ("category_id", "product_id"))`);
        await queryRunner.query(`INSERT INTO "category_products_product"("category_id", "product_id") SELECT "category_id", "product_id" FROM "temporary_category_products_product"`);
        await queryRunner.query(`DROP TABLE "temporary_category_products_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_3071808e19df360b703fc6ee1d" ON "category_products_product" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d7c51e7e113812de685d88df3" ON "category_products_product" ("category_id") `);
        await queryRunner.query(`DROP INDEX "IDX_3071808e19df360b703fc6ee1d"`);
        await queryRunner.query(`DROP INDEX "IDX_8d7c51e7e113812de685d88df3"`);
        await queryRunner.query(`DROP TABLE "category_products_product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
