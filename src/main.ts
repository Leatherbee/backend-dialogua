import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

async function bootstrap() {
  dotenv.config();
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'uploads/levels/banners');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from the uploads directory
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/levels/banners',
  });
  
  // Add a redirect from the old path to the new one for backward compatibility
  app.use('/uploads/levels/banner', (req, res, next) => {
    const newPath = req.url.replace(/^\/banner\//, '/banners/');
    res.redirect(308, newPath);
  });
  
  app.enableCors();
  
  const port = process.env.PORT ?? 7575;
  await app.listen(port);
  
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Serving static files from: ${uploadsDir}`);
}

export async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'uploads/levels/banners');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static files from the uploads directory
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/levels/banners',
  });
  
  // Add a redirect from the old path to the new one for backward compatibility
  app.use('/uploads/levels/banner', (req, res, next) => {
    const newPath = req.url.replace(/^\/banner\//, '/banners/');
    res.redirect(308, newPath);
  });

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
