import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 7575);
  console.log(
    `Server listening on http://localhost:${process.env.PORT ?? 7575}`,
  );
}

export async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors();

  await app.init();
  return expressApp;
}

if (require.main === module) {
  bootstrap();
}

let cachedApp: express.Application | null = null;

export default async function (req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrapServer();
  }

  cachedApp(req, res);
}
