import { BadRequestException } from '@nestjs/common';
import { validateDocumentFile } from './document-file.validator';

function upload(originalname: string, bytes: number[], mimetype = 'application/octet-stream') {
  const buffer = Buffer.from(bytes);
  return { originalname, mimetype, buffer, size: buffer.length } as Express.Multer.File;
}

describe('validateDocumentFile', () => {
  it('accepts a PDF by extension and binary signature, ignoring the claimed MIME type', () => {
    const result = validateDocumentFile(upload('contract.pdf', [0x25, 0x50, 0x44, 0x46, 0x2d]));
    expect(result).toEqual({ extension: '.pdf', mimeType: 'application/pdf' });
  });

  it('accepts modern Office ZIP containers', () => {
    const result = validateDocumentFile(upload('calculation.xlsx', [0x50, 0x4b, 0x03, 0x04]));
    expect(result.mimeType).toContain('spreadsheetml');
  });

  it('rejects a supported extension with mismatched contents', () => {
    expect(() => validateDocumentFile(upload('spoofed.pdf', [0x50, 0x4b, 0x03, 0x04]))).toThrow(BadRequestException);
  });

  it('rejects unsupported extensions', () => {
    expect(() => validateDocumentFile(upload('script.exe', [0x4d, 0x5a]))).toThrow('Unterstützt werden');
  });
});
