import { BadRequestException } from '@nestjs/common';
import { extname } from 'node:path';

const allowed: Record<string, { mimeType: string; signature: 'pdf' | 'png' | 'jpeg' | 'ole' | 'zip' }> = {
  '.pdf': { mimeType: 'application/pdf', signature: 'pdf' },
  '.png': { mimeType: 'image/png', signature: 'png' },
  '.jpg': { mimeType: 'image/jpeg', signature: 'jpeg' },
  '.jpeg': { mimeType: 'image/jpeg', signature: 'jpeg' },
  '.doc': { mimeType: 'application/msword', signature: 'ole' },
  '.docx': { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', signature: 'zip' },
  '.xls': { mimeType: 'application/vnd.ms-excel', signature: 'ole' },
  '.xlsx': { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', signature: 'zip' },
};

const signatures = {
  pdf: (buffer: Buffer) => buffer.subarray(0, 5).toString() === '%PDF-',
  png: (buffer: Buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  jpeg: (buffer: Buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  ole: (buffer: Buffer) => buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  zip: (buffer: Buffer) => buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
};

export function validateDocumentFile(file?: Express.Multer.File) {
  if (!file?.buffer?.length) throw new BadRequestException('Eine Datei ist erforderlich.');
  const extension = extname(file.originalname).toLowerCase();
  const expected = allowed[extension];
  if (!expected) throw new BadRequestException('Unterstützt werden PDF, PNG, JPEG, DOC, DOCX, XLS und XLSX.');
  if (!signatures[expected.signature](file.buffer)) throw new BadRequestException('Dateiendung und tatsächlicher Dateiinhalt stimmen nicht überein.');
  return { extension, mimeType: expected.mimeType };
}
