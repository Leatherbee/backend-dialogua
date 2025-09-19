1. Global Rules for the AI Agent

These are the global conventions and requirements that must always be followed.

Rule 1 — Tech Stack & Conventions

The stack is NestJS + TypeORM + PostgreSQL.

Every table in PostgreSQL must have a corresponding TypeORM entity.

Table naming convention:

Database tables → snake_case (e.g., unit_levels)

Entities → PascalCase (e.g., UnitLevel)

Each entity must include:

@Entity({ name: 'table_name' }) annotation with exact DB table name.

@PrimaryGeneratedColumn() for SERIAL or UUID primary keys.

@ManyToOne, @OneToMany, @JoinColumn for relationships.

Folder structure per module:

src/
├─ modules/
│ ├─ program/
│ │ ├─ program.entity.ts
│ │ ├─ program.service.ts
│ │ ├─ program.controller.ts
│ │ ├─ program.module.ts
│ │
│ ├─ unit/
│ │ ├─ unit.entity.ts
│ │ ├─ unit.service.ts
│ │ ├─ unit.controller.ts
│ │ ├─ unit.module.ts
│ │
│ └─ ... (other modules)
└─ database/
├─ migrations/
└─ seeds/

Rule 2 — ENUM Conversion

All PostgreSQL ENUMs must be translated into TypeScript enums and stored in an enums.ts file inside their respective modules.

Example: PostgreSQL ENUM

CREATE TYPE quiz_type_enum AS ENUM ('multiple_choice', 'video_comprehension');

TypeScript ENUM:

export enum QuizType {
MULTIPLE_CHOICE = 'multiple_choice',
VIDEO_COMPREHENSION = 'video_comprehension',
}

Rule 3 — Entity Relationships

One-to-Many (1:N) relationships must use:

@OneToMany(() => Unit, unit => unit.program)
units: Unit[];

@ManyToOne(() => Program, program => program.units)
@JoinColumn({ name: 'program_id' })
program: Program;

Many-to-Many (M:N) must have a separate pivot table.

Relationships must always be bidirectional for easy querying with relations: [].

Rule 4 — Minimum Module Files

Each module must include:

File Purpose
entity.ts The database entity model.
dto/create-xxx.dto.ts DTO for creating new records.
dto/update-xxx.dto.ts DTO for updating existing records.
service.ts Business logic and database operations.
controller.ts REST API endpoints.
module.ts Module definition.
migration.ts Database migrations for syncing schema.
Rule 5 — JSONB Handling

PostgreSQL JSONB columns must be declared as:

@Column('jsonb', { default: () => "'{}'" })
metadata: Record<string, any>;

Services must parse JSONB as standard JavaScript objects.

2. Database Modules & Entities

The database is divided into multiple functional modules, each with its own entities.

Module Entity Description
Program Program BIPA programs like BIPA 1, BIPA 2, etc.
Unit Unit Topics like "Family", "Health".
Level UnitLevel Dynamic levels within a unit.
Media MediaAsset Repository of all images, videos, audio files.
Content ContentItem Content that can be either Quiz or Roleplay.
Quiz Quiz, QuizOption Quiz base and options for MCQ/Video/Audio.
Matching MatchingQuestion, MatchingPair Matching quiz type.
Form Filling FormQuestion, FormField Form-filling quiz type.
Roleplay Roleplay, RoleplayTurn Video-split roleplay dialogs.
User Progress UserLevelProgress User progress tracking per level.
User Attempt RoleplayAttempt Logs for roleplay attempts. 3. Entity Examples
Program Entity
@Entity({ name: 'programs' })
export class Program {
@PrimaryGeneratedColumn()
programId: number;

@Column({ unique: true })
code: string; // Example: BIPA1

@Column()
name: string;

@Column('jsonb', { default: () => "'{}'" })
metadata: Record<string, any>;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

@OneToMany(() => Unit, unit => unit.program)
units: Unit[];
}

Unit Entity
@Entity({ name: 'units' })
export class Unit {
@PrimaryGeneratedColumn()
unitId: number;

@Column()
code: string;

@Column()
title: string;

@Column()
position: number;

@Column('jsonb', { default: () => "'{}'" })
metadata: Record<string, any>;

@ManyToOne(() => Program, program => program.units)
@JoinColumn({ name: 'program_id' })
program: Program;

@OneToMany(() => UnitLevel, level => level.unit)
levels: UnitLevel[];
}

UnitLevel Entity
@Entity({ name: 'unit_levels' })
export class UnitLevel {
@PrimaryGeneratedColumn()
levelId: number;

@Column()
name: string;

@Column()
position: number;

@ManyToOne(() => Unit, unit => unit.levels)
@JoinColumn({ name: 'unit_id' })
unit: Unit;

@OneToMany(() => ContentItem, content => content.level)
contents: ContentItem[];
}

MediaAsset Entity
export enum MediaType {
IMAGE = 'image',
VIDEO = 'video',
AUDIO = 'audio',
}

@Entity({ name: 'media_assets' })
export class MediaAsset {
@PrimaryGeneratedColumn()
mediaId: number;

@Column({
type: 'enum',
enum: MediaType,
})
mediaType: MediaType;

@Column()
url: string;

@Column({ nullable: true })
altText: string;

@CreateDateColumn()
createdAt: Date;
}

ContentItem Entity
export enum ContentType {
QUIZ = 'quiz',
ROLEPLAY = 'roleplay',
}

@Entity({ name: 'content_items' })
export class ContentItem {
@PrimaryGeneratedColumn()
contentId: number;

@Column({
type: 'enum',
enum: ContentType,
})
contentType: ContentType;

@Column()
title: string;

@Column()
objective: string;

@Column({ nullable: true })
promptText: string;

@ManyToOne(() => UnitLevel, level => level.contents)
@JoinColumn({ name: 'level_id' })
level: UnitLevel;

@ManyToOne(() => MediaAsset, { nullable: true })
@JoinColumn({ name: 'primary_media_id' })
primaryMedia: MediaAsset;
}

4. Required Methods in Services

Each service must implement the following default methods:

Method Description
findAll() Retrieve all records.
findOne(id: number) Retrieve a record by ID.
create(dto) Insert new data.
update(id: number, dto) Update existing record.
delete(id: number) Soft or hard delete data. 5. REST Endpoint Structure

Each controller must expose the following endpoints:

HTTP Method Endpoint Description
GET /entity Get all entities
GET /entity/:id Get single entity
POST /entity Create entity
PATCH /entity/:id Update entity
DELETE /entity/:id Delete entity

Example for ProgramController:

GET /programs
GET /programs/:id
POST /programs
PATCH /programs/:id
DELETE /programs/:id

6. Final Module List
   modules/
   ├── program/ # Programs like BIPA1, BIPA2
   ├── unit/ # Units (topics)
   ├── unit-level/ # Levels inside units
   ├── media/ # Media repository
   ├── content-item/ # Quiz & Roleplay content
   ├── quiz/ # Base quiz logic
   ├── quiz-option/ # MCQ options
   ├── matching/ # Matching question + pairs
   ├── form/ # Form filling questions
   ├── roleplay/ # Roleplay scenarios
   ├── user-level-progress/ # Tracks user progress
   └── roleplay-attempt/ # Logs each roleplay attempt

7. Logic Flow for Backend
   Flow Modules Involved
   Fetch all levels for UI UnitLevelModule + joins Unit + Program
   Fetch content for a level ContentItemModule, QuizModule, RoleplayModule
   Update user progress UserLevelProgressModule
   Log roleplay attempt RoleplayAttemptModule

# Original Database Schema

```sql
DO $$ BEGIN
  CREATE TYPE content_type_enum AS ENUM ('quiz', 'roleplay');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE quiz_type_enum AS ENUM ('multiple_choice', 'video_comprehension', 'audio_comprehension', 'form_filling', 'matching_item');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE roleplay_speaker_enum AS ENUM ('system', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE match_left_kind_enum AS ENUM ('text', 'image');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE form_field_type_enum AS ENUM ('text', 'textarea', 'date', 'select', 'country', 'phone');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===== Core curriculum =====
CREATE TABLE IF NOT EXISTS programs (
  program_id       SERIAL PRIMARY KEY,
  code             TEXT NOT NULL UNIQUE,         -- e.g., 'BIPA1'
  name             TEXT NOT NULL,                -- e.g., 'BIPA 1'
  metadata         JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS units (
  unit_id          SERIAL PRIMARY KEY,
  program_id       INT NOT NULL REFERENCES programs(program_id) ON DELETE CASCADE,
  code             TEXT,                         -- e.g., '1', '2', '3', ...
  title            TEXT NOT NULL,                -- e.g., 'Perkenalan'
  position         INT NOT NULL,                 -- ordering inside program
  objective        TEXT,                         -- optional learning objective summary
  metadata         JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(program_id, position)
);

-- Dinamis: level/stage di dalam unit
CREATE TABLE IF NOT EXISTS unit_levels (
  level_id         SERIAL PRIMARY KEY,
  unit_id          INT NOT NULL REFERENCES units(unit_id) ON DELETE CASCADE,
  name             TEXT,                         -- e.g., 'Level 1', 'Level 2' (opsional)
  position         INT NOT NULL,                 -- ordering inside unit
  metadata         JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(unit_id, position)
);

-- ===== Media repository =====
CREATE TABLE IF NOT EXISTS media_assets (
  media_id         SERIAL PRIMARY KEY,
  media_type       media_type_enum NOT NULL,     -- image/video/audio/document
  url              TEXT NOT NULL,
  duration_sec     NUMERIC,                      -- for audio/video
  transcript       TEXT,                         -- for audio/video comprehension if needed
  alt_text         TEXT,
  metadata         JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ===== Content item (quiz or roleplay) =====
CREATE TABLE IF NOT EXISTS content_items (
  content_id       SERIAL PRIMARY KEY,
  level_id         INT NOT NULL REFERENCES unit_levels(level_id) ON DELETE CASCADE,
  content_type     content_type_enum NOT NULL,   -- 'quiz' | 'roleplay'
  position         INT NOT NULL,                 -- ordering inside level
  title            TEXT,                         -- short title (optional)
  objective        TEXT,                         -- learning objective for this item
  prompt_text      TEXT,                         -- generic prompt (e.g., question stem or roleplay scenario summary)
  primary_media_id INT REFERENCES media_assets(media_id) ON DELETE SET NULL,  -- main media if any
  metadata         JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(level_id, position)
);

-- ===== QUIZ layer =====
CREATE TABLE IF NOT EXISTS quizzes (
  quiz_id          SERIAL PRIMARY KEY,
  content_id       INT NOT NULL UNIQUE REFERENCES content_items(content_id) ON DELETE CASCADE,
  quiz_type        quiz_type_enum NOT NULL,
  question_text    TEXT,                         -- stem
  metadata         JSONB DEFAULT '{}'::jsonb
  -- NOTE: per-type detail di tabel terpisah di bawah
);

-- Multiple Choice (termasuk Video/Audio comprehension yang pakai opsi)
-- Gunakan tabel opsional umum: quiz_options
CREATE TABLE IF NOT EXISTS quiz_options (
  option_id        SERIAL PRIMARY KEY,
  quiz_id          INT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  text             TEXT NOT NULL,
  is_correct       BOOLEAN NOT NULL DEFAULT FALSE,
  position         INT NOT NULL,
  metadata         JSONB DEFAULT '{}'::jsonb,
  UNIQUE(quiz_id, position)
);

-- Video/Audio comprehension bisa dibedakan via quizzes.quiz_type
-- dan media utama ada di content_items.primary_media_id (video/audio)

-- Form Filling
CREATE TABLE IF NOT EXISTS form_questions (
  form_id          SERIAL PRIMARY KEY,
  quiz_id          INT NOT NULL UNIQUE REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  instructions     TEXT,
  metadata         JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS form_fields (
  field_id         SERIAL PRIMARY KEY,
  form_id          INT NOT NULL REFERENCES form_questions(form_id) ON DELETE CASCADE,
  position         INT NOT NULL,
  field_type       form_field_type_enum NOT NULL, -- text/textarea/date/select/country/phone
  label            TEXT NOT NULL,
  placeholder      TEXT,
  required         BOOLEAN DEFAULT TRUE,
  options          TEXT[],                        -- for select/country etc.
  default_value    TEXT,
  metadata         JSONB DEFAULT '{}'::jsonb,
  UNIQUE(form_id, position)
);

-- Matching Item
CREATE TABLE IF NOT EXISTS matching_questions (
  matching_id      SERIAL PRIMARY KEY,
  quiz_id          INT NOT NULL UNIQUE REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  instructions     TEXT,
  metadata         JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS matching_pairs (
  pair_id          SERIAL PRIMARY KEY,
  matching_id      INT NOT NULL REFERENCES matching_questions(matching_id) ON DELETE CASCADE,
  position         INT NOT NULL,
  left_kind        match_left_kind_enum NOT NULL,     -- 'text' or 'image'
  left_text        TEXT,                               -- used if left_kind = text
  left_media_id    INT REFERENCES media_assets(media_id) ON DELETE SET NULL,  -- used if left_kind = image
  right_text       TEXT NOT NULL,                      -- canonical label to match
  metadata         JSONB DEFAULT '{}'::jsonb,
  CHECK ( (left_kind = 'text' AND left_text IS NOT NULL AND left_media_id IS NULL)
       OR (left_kind = 'image' AND left_media_id IS NOT NULL AND left_text IS NULL) ),
  UNIQUE(matching_id, position)
);

-- ===== ROLEPLAY layer =====
CREATE TABLE IF NOT EXISTS roleplays (
  roleplay_id      SERIAL PRIMARY KEY,
  content_id       INT NOT NULL UNIQUE REFERENCES content_items(content_id) ON DELETE CASCADE,
  scenario_text    TEXT NOT NULL,                  -- full scenario
  metadata         JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS roleplay_turns (
  turn_id          SERIAL PRIMARY KEY,
  roleplay_id      INT NOT NULL REFERENCES roleplays(roleplay_id) ON DELETE CASCADE,
  position         INT NOT NULL,
  speaker          roleplay_speaker_enum NOT NULL, -- 'ai' | 'user' | 'system'
  text             TEXT,                           -- utterance or expected prompt
  media_id         INT REFERENCES media_assets(media_id) ON DELETE SET NULL,
  evaluation_hint  TEXT,                           -- rubric/keywords for checking user response
  metadata         JSONB DEFAULT '{}'::jsonb,
  UNIQUE(roleplay_id, position)
);

-- ===== Helpful indexes =====
CREATE INDEX IF NOT EXISTS idx_units_program ON units(program_id);
CREATE INDEX IF NOT EXISTS idx_levels_unit ON unit_levels(unit_id);
CREATE INDEX IF NOT EXISTS idx_content_level ON content_items(level_id);
CREATE INDEX IF NOT EXISTS idx_quiz_content ON quizzes(content_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_assets(media_type);
```