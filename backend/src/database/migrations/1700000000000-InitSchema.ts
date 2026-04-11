import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('manager', 'developer');

      CREATE TABLE "user" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"      VARCHAR(255) NOT NULL UNIQUE,
        "password"   VARCHAR(255) NOT NULL,
        "role"       user_role_enum NOT NULL DEFAULT 'developer',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE "project" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"      VARCHAR(255) NOT NULL,
        "color"      VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
        "owner_id"   UUID NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE "board_column" (
        "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"      VARCHAR(255) NOT NULL,
        "position"   INTEGER NOT NULL DEFAULT 0,
        "project_id" UUID NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE "card" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title"       VARCHAR(255) NOT NULL,
        "description" TEXT,
        "due_date"    VARCHAR(20),
        "position"    INTEGER NOT NULL DEFAULT 0,
        "column_id"   UUID NOT NULL REFERENCES "board_column"("id") ON DELETE CASCADE,
        "assignee_id" UUID REFERENCES "user"("id") ON DELETE SET NULL,
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE "card_label" (
        "id"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "text"    VARCHAR(100) NOT NULL,
        "color"   VARCHAR(20)  NOT NULL,
        "card_id" UUID NOT NULL REFERENCES "card"("id") ON DELETE CASCADE
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "card_label";
      DROP TABLE IF EXISTS "card";
      DROP TABLE IF EXISTS "board_column";
      DROP TABLE IF EXISTS "project";
      DROP TABLE IF EXISTS "user";
      DROP TYPE IF EXISTS user_role_enum;
    `)
  }
}