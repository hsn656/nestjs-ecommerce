import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventory1682784546432 implements MigrationInterface {
  name = 'AddInventory1682784546432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "color" ("name" character varying(30) NOT NULL, "hexCode" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_229c1a96f14d7187fccf3684ecc" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("code" character varying(7) NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ff4c23dc9a3f3856555bd86186" PRIMARY KEY ("code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency" ("code" character varying(7) NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_723472e41cae44beb0763f4039c" PRIMARY KEY ("code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "size" ("code" character varying(30) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4dd6860deef208c5fc96c6d311f" PRIMARY KEY ("code"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "countryCode" character varying(7) NOT NULL, "variationType" character varying NOT NULL, "sizeCode" character varying(7) NOT NULL, "colorName" character varying(30) NOT NULL, "quantity" integer NOT NULL, "price" double precision NOT NULL, "currencyCode" character varying(7) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_c8622e1e24c6d054d36e8824490" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_8c027794f89b1607ccbba284ec5" FOREIGN KEY ("countryCode") REFERENCES "country"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_188af456487d2b7ad0674fb955d" FOREIGN KEY ("sizeCode") REFERENCES "size"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_ff71e66da96a48490a9e35e7ecd" FOREIGN KEY ("colorName") REFERENCES "color"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_448c7f71a4843815dae2ceb379c" FOREIGN KEY ("currencyCode") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_448c7f71a4843815dae2ceb379c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_ff71e66da96a48490a9e35e7ecd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_188af456487d2b7ad0674fb955d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_8c027794f89b1607ccbba284ec5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_c8622e1e24c6d054d36e8824490"`,
    );
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TABLE "size"`);
    await queryRunner.query(`DROP TABLE "currency"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "color"`);
  }
}
