import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: express.Application | null = null;

async function createApp(): Promise<express.Application> {
  const expressApp = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn'], 
    },
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();

  return expressApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!cachedApp) {
      cachedApp = await createApp();
    }

    cachedApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
