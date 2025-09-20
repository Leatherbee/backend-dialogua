import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/modules/users/entities/user.entity';
import { UserLevelProgress } from './src/modules/progress/entities/progress.entity';
import { Program } from './src/modules/programs/entities/program.entity';
import { Level } from './src/modules/levels/entities/level.entity';
import { Quiz } from './src/modules/quizzes/entities/quiz.entity';
import { QuizOption } from './src/modules/quizzes/entities/quiz-option.entity';
import { QuizMedia } from './src/modules/quizzes/entities/quiz-media.entity';
import { QuizMatchingPair } from './src/modules/quizzes/entities/quiz-matching-pair.entity';
import { Roleplay } from './src/modules/roleplays/entities/roleplay.entity';
import { RoleplayTurn } from './src/modules/roleplays/entities/roleplay-turn.entity';
import { RefreshToken } from './src/modules/auth/entities/refresh-token.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'dialogua_db',
  entities: [
    User,
    UserLevelProgress,
    Program,
    Level,
    Quiz,
    QuizOption,
    QuizMedia,
    QuizMatchingPair,
    Roleplay,
    RoleplayTurn,
    RefreshToken,
  ],
  migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});

export default dataSource;
