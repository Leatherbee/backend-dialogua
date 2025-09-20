import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1758370460807 implements MigrationInterface {
  name = 'InitialSchema1758370460807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quiz_matching_pairs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "left_text" character varying(255), "right_text" character varying(255), "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, "leftMediaId" uuid, "rightMediaId" uuid, CONSTRAINT "PK_d6b373a8db50a426a39871a6561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quiz_media_media_type_enum" AS ENUM('image', 'video', 'audio')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "media_type" "public"."quiz_media_media_type_enum" NOT NULL, "url" character varying(500) NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, "quizOptionId" uuid, "matchingPairId" uuid, CONSTRAINT "PK_c4e6293961ae14e71d49e4b4695" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_multiple_choice_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "option_text" character varying(255), "is_correct" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, "mediaId" uuid, CONSTRAINT "PK_3e84465e76e84f13201c0588dd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quizzes_quiz_type_enum" AS ENUM('multiple_choice', 'matching_item')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255), "question" text NOT NULL, "explanation" text, "objective" text, "quiz_type" "public"."quizzes_quiz_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "levelId" uuid, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roleplay_turns" ("id" SERIAL NOT NULL, "turn_order" integer NOT NULL, "speaker" character varying(50) NOT NULL, "message" text NOT NULL, "video_url" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleplayId" uuid, CONSTRAINT "PK_98ed7f417aa137b654a28192034" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roleplays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scenario" character varying(500) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "levelId" uuid, CONSTRAINT "PK_4c5c373ffa2f676de59f99201f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."levels_content_type_enum" AS ENUM('quiz', 'roleplay')`,
    );
    await queryRunner.query(
      `CREATE TABLE "levels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "level_number" integer NOT NULL, "content_type" "public"."levels_content_type_enum" NOT NULL, "title" character varying(255), "description" text NOT NULL, "unit_number" integer, "unit_name" character varying(255), "objective" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "programId" uuid, CONSTRAINT "UQ_program_level_number" UNIQUE ("programId", "level_number"), CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "program_code" character varying(255) NOT NULL, "title" character varying(255), "chapter" character varying(255) NOT NULL, "description" text, "image_url" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4022f5e5cbd407a4da90d37f642" UNIQUE ("program_code"), CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_level_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completed" boolean NOT NULL DEFAULT false, "completed_at" TIMESTAMP, "last_played_at" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "programId" uuid, "levelId" uuid, CONSTRAINT "UQ_user_level" UNIQUE ("userId", "levelId"), CONSTRAINT "PK_120032b1a1bb84e2c36d83b97aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_program" ON "user_level_progress" ("userId", "programId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255), "last_name" character varying(255), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "appleId" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "token" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE ("token"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" ADD CONSTRAINT "FK_5208a653caf86378b1178419aa1" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" ADD CONSTRAINT "FK_00be999c9a4fbc0ffac524a1d42" FOREIGN KEY ("leftMediaId") REFERENCES "quiz_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" ADD CONSTRAINT "FK_031f7feee92b2df11f489e5c518" FOREIGN KEY ("rightMediaId") REFERENCES "quiz_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" ADD CONSTRAINT "FK_7d406e28e7a5d4a2fa8c014a00e" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" ADD CONSTRAINT "FK_423c64769d84e61be8e341d56c1" FOREIGN KEY ("quizOptionId") REFERENCES "quiz_multiple_choice_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" ADD CONSTRAINT "FK_cdc7ef1dbb4a936aab33c0cc780" FOREIGN KEY ("matchingPairId") REFERENCES "quiz_matching_pairs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_multiple_choice_options" ADD CONSTRAINT "FK_89bfd0d0beca9d4b15c1ad89ecb" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_multiple_choice_options" ADD CONSTRAINT "FK_4cd2b84bb2eac1cdc265939f760" FOREIGN KEY ("mediaId") REFERENCES "quiz_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_40553e217b963b49cdfca235399" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleplay_turns" ADD CONSTRAINT "FK_c032b56aad43f7b34276bb12760" FOREIGN KEY ("roleplayId") REFERENCES "roleplays"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleplays" ADD CONSTRAINT "FK_c2d0be66cc73c9c7bff573bb7e7" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" ADD CONSTRAINT "FK_e9c89c1147911cd54dc3421cf73" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" ADD CONSTRAINT "FK_1793f6e762ce334332a80ba05e5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" ADD CONSTRAINT "FK_1b85c0fa28448a8bf3a6f947525" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" ADD CONSTRAINT "FK_5f248dce13a3357365024f7d47f" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" DROP CONSTRAINT "FK_5f248dce13a3357365024f7d47f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" DROP CONSTRAINT "FK_1b85c0fa28448a8bf3a6f947525"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_level_progress" DROP CONSTRAINT "FK_1793f6e762ce334332a80ba05e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" DROP CONSTRAINT "FK_e9c89c1147911cd54dc3421cf73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleplays" DROP CONSTRAINT "FK_c2d0be66cc73c9c7bff573bb7e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleplay_turns" DROP CONSTRAINT "FK_c032b56aad43f7b34276bb12760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_40553e217b963b49cdfca235399"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_multiple_choice_options" DROP CONSTRAINT "FK_4cd2b84bb2eac1cdc265939f760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_multiple_choice_options" DROP CONSTRAINT "FK_89bfd0d0beca9d4b15c1ad89ecb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" DROP CONSTRAINT "FK_cdc7ef1dbb4a936aab33c0cc780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" DROP CONSTRAINT "FK_423c64769d84e61be8e341d56c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_media" DROP CONSTRAINT "FK_7d406e28e7a5d4a2fa8c014a00e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" DROP CONSTRAINT "FK_031f7feee92b2df11f489e5c518"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" DROP CONSTRAINT "FK_00be999c9a4fbc0ffac524a1d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_matching_pairs" DROP CONSTRAINT "FK_5208a653caf86378b1178419aa1"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_program"`);
    await queryRunner.query(`DROP TABLE "user_level_progress"`);
    await queryRunner.query(`DROP TABLE "programs"`);
    await queryRunner.query(`DROP TABLE "levels"`);
    await queryRunner.query(`DROP TYPE "public"."levels_content_type_enum"`);
    await queryRunner.query(`DROP TABLE "roleplays"`);
    await queryRunner.query(`DROP TABLE "roleplay_turns"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TYPE "public"."quizzes_quiz_type_enum"`);
    await queryRunner.query(`DROP TABLE "quiz_multiple_choice_options"`);
    await queryRunner.query(`DROP TABLE "quiz_media"`);
    await queryRunner.query(`DROP TYPE "public"."quiz_media_media_type_enum"`);
    await queryRunner.query(`DROP TABLE "quiz_matching_pairs"`);
  }
}
