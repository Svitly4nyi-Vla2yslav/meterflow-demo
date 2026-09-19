import type { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/aws-lambda-compat';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

type ServerlessHandler = ReturnType<typeof serverless>;
let cachedHandler: ServerlessHandler | undefined;

export const binaryMimeTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
];

export const createServerlessHandler = (application: Parameters<typeof serverless>[0]) =>
  serverless(application, { binary: binaryMimeTypes });

async function getHandler() {
  if (cachedHandler) return cachedHandler;
  const expressApp = express();
  const nestApp = configureApp(await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : undefined }));
  await nestApp.init();
  cachedHandler = createServerlessHandler(expressApp);
  return cachedHandler;
}

export const netlifyHandler = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> => await (await getHandler())(event, context) as HandlerResponse;
