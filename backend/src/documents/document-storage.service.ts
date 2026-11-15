import { getStore } from '@netlify/blobs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

@Injectable()
export class DocumentStorageService {
  private readonly directory = resolve(process.cwd(), '.local-storage', 'documents');
  private readonly useBlobs = process.env.DOCUMENT_STORAGE === 'netlify-blobs';

  /**
   * Визначає активний драйвер під час створення сервісу та журналює лише його тип і стан конфігурації.
   * Значення секретів або вміст документів у лог не потрапляють.
   */
  constructor() {
    console.info('[DocumentStorage]', {
      driver: this.useBlobs ? 'netlify-blobs' : 'local',
      nodeEnv: process.env.NODE_ENV,
      documentStorageConfigured: Boolean(process.env.DOCUMENT_STORAGE),
    });
  }

  /**
   * Зберігає байти документа за ключем у Netlify Blobs або локальному каталозі.
   * @param key — відносний ключ об’єкта, сформований сервісом документів.
   * @param data — незмінюваний вміст файла у Buffer.
   * @param metadata — метадані для Netlify Blobs; локальний драйвер їх не записує.
   * @sideEffects Створює каталоги/файл або виконує зовнішній запис у blob store.
   */
  async put(key: string, data: Buffer, metadata: Record<string, string>) {
    if (this.useBlobs) {
      const store = getStore('meterflow-documents');
      const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
      await store.set(key, arrayBuffer, { metadata });
      return;
    }
    const filePath = join(this.directory, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, data);
  }

  async get(key: string) {
    try {
      if (this.useBlobs) {
        const store = getStore('meterflow-documents');
        const value = await store.get(key, { type: 'arrayBuffer' });
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
      const store = getStore('meterflow-documents');
      await store.delete(key);
      return;
    }
    await unlink(join(this.directory, key)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}
