import { createHash } from 'node:crypto';
import { withLambda, type HandlerResponse } from '@netlify/aws-lambda-compat';
import express from 'express';
import serverless from 'serverless-http';
import { binaryMimeTypes, createServerlessHandler } from './serverless-handler';

const binaryFixtures = [
  ['PDF', 'application/pdf', Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x00, 0xff, 0xfe, 0x80, 0x0a, 0x25, 0x25, 0x45, 0x4f, 0x46])],
  ['PNG', 'image/png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff])],
  ['JPEG', 'image/jpeg', Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x80, 0xff, 0xd9])],
  ['DOCX', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0xff, 0x80])],
  ['XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', Buffer.from([0x50, 0x4b, 0x03, 0x04, 0xfe, 0xff, 0x00])],
] as const;

const sha256 = (value: Buffer) => createHash('sha256').update(value).digest('hex');

const eventFor = (path: string) => ({
  body: null,
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  path,
  queryStringParameters: null,
  requestContext: { identity: { sourceIp: '127.0.0.1' } },
});

describe('serverless binary responses', () => {
  const app = express();

  for (const [name, mimeType, bytes] of binaryFixtures) {
    app.get(`/${name.toLowerCase()}`, (_request, response) => {
      response.setHeader('Content-Type', mimeType);
      response.setHeader('Content-Length', bytes.length);
      response.send(bytes);
    });
  }

  app.get('/json', (_request, response) => response.json({ status: 'ok' }));

  const handler = createServerlessHandler(app);
  const modernHandler = withLambda(async (event, context): Promise<HandlerResponse> =>
    await handler(event, context) as HandlerResponse);

  it.each(binaryFixtures)('returns %s bytes as a byte-perfect base64 Lambda response', async (name, mimeType, expected) => {
    const result = await handler(eventFor(`/${name.toLowerCase()}`), {});
    const response = result as {
      body: string;
      headers: Record<string, string>;
      isBase64Encoded: boolean;
      statusCode: number;
    };
    const actual = Buffer.from(response.body, 'base64');

    expect(response.statusCode).toBe(200);
    expect(response.isBase64Encoded).toBe(true);
    expect(response.headers['content-type']).toBe(mimeType);
    expect(response.headers['content-length']).toBe(String(expected.length));
    expect(actual.length).toBe(expected.length);
    expect(sha256(actual)).toBe(sha256(expected));
    expect(actual).toEqual(expected);
  });

  it('leaves JSON responses as non-binary UTF-8 responses', async () => {
    const result = await handler(eventFor('/json'), {});
    const response = result as { body: string; headers: Record<string, string>; isBase64Encoded: boolean };

    expect(response.isBase64Encoded).toBe(false);
    expect(response.headers['content-type']).toMatch(/^application\/json/);
    expect(JSON.parse(response.body)).toEqual({ status: 'ok' });
  });

  it.each(binaryFixtures)('preserves %s bytes through the modern Request/Response wrapper', async (name, mimeType, expected) => {
    const response = await modernHandler(new Request(`https://meterflow.test/${name.toLowerCase()}`), { requestId: 'test-request' } as never);
    const actual = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(mimeType);
    expect(response.headers.get('content-length')).toBe(String(expected.length));
    expect(actual.length).toBe(expected.length);
    expect(sha256(actual)).toBe(sha256(expected));
    expect(actual).toEqual(expected);
  });

  it('keeps JSON non-binary through the modern Request/Response wrapper', async () => {
    const response = await modernHandler(new Request('https://meterflow.test/json'), { requestId: 'test-request' } as never);

    expect(response.headers.get('content-type')).toMatch(/^application\/json/);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });

  it('demonstrates the previous unconfigured handler corrupts binary PDF bytes', async () => {
    const legacyHandler = serverless(app);
    const result = await legacyHandler(eventFor('/pdf'), {});
    const response = result as { body: string; isBase64Encoded: boolean };
    const original = binaryFixtures[0][2];
    const reconstructed = Buffer.from(response.body, 'utf8');

    expect(response.isBase64Encoded).toBe(false);
    expect(reconstructed.length).not.toBe(original.length);
    expect(sha256(reconstructed)).not.toBe(sha256(original));
  });

  it('contains every supported document MIME type in the binary allowlist', () => {
    expect(binaryMimeTypes).toEqual(expect.arrayContaining([
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream',
    ]));
  });
});
