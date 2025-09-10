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
  // Enable CORS for all origins (you can restrict this in production)
  app.enableCors();
  await app.listen(process.env.PORT ?? 7575);
}

// For Vercel serverless functions, we need to export the server
export async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Enable CORS for all origins (you can restrict this in production)
  app.enableCors();

  await app.init();
  return expressApp;
}

// Only call bootstrap if this file is run directly (not imported)
if (require.main === module) {
  bootstrap();
}

// Export the express app for Vercel
let cachedApp: express.Application | null = null;

export default async function (req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrapServer();
  }

  cachedApp(req, res);
}
