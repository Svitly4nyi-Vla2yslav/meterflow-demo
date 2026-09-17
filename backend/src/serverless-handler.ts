import type { Handler, HandlerResponse } from '@netlify/functions';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

type ServerlessHandler = ReturnType<typeof serverless>;
let cachedHandler: ServerlessHandler | undefined;

async function getHandler() {
  if (cachedHandler) return cachedHandler;
  const expressApp = express();
  const nestApp = configureApp(await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : undefined }));
  await nestApp.init();
  cachedHandler = serverless(expressApp);
  return cachedHandler;
}

export const netlifyHandler: Handler = async (event, context) => await (await getHandler())(event, context) as HandlerResponse;
