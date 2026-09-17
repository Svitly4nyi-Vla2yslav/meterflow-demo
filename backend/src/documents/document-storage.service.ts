import { getStore } from '@netlify/blobs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

@Injectable()
export class DocumentStorageService {
  private readonly directory = resolve(process.cwd(), '.local-storage', 'documents');
  private readonly useBlobs = process.env.NODE_ENV === 'production' && process.env.NETLIFY === 'true';

  async put(key: string, data: Buffer, metadata: Record<string, string>) {
    if (this.useBlobs) {
      const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
      await getStore('meterflow-documents').set(key, arrayBuffer, { metadata });
      return;
    }
    await mkdir(this.directory, { recursive: true });
    await writeFile(join(this.directory, key), data);
  }

  async get(key: string) {
    try {
      if (this.useBlobs) {
        const value = await getStore('meterflow-documents').get(key, { type: 'arrayBuffer' });
        if (!value) throw new NotFoundException('Dateiinhalt wurde nicht gefunden.');
        return Buffer.from(value);
      }
      return await readFile(join(this.directory, key));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException('Dateiinhalt wurde nicht gefunden.');
    }
  }

  async remove(key: string) {
    if (this.useBlobs) {
      await getStore('meterflow-documents').delete(key);
      return;
    }
    await unlink(join(this.directory, key)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}
