import { getStore } from '@netlify/blobs';
import { NotFoundException } from '@nestjs/common';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DocumentStorageService } from './document-storage.service';

jest.mock('@netlify/blobs', () => ({ getStore: jest.fn() }));

describe('DocumentStorageService', () => {
  const originalCwd = process.cwd();
  const originalDocumentStorage = process.env.DOCUMENT_STORAGE;
  const originalNetlify = process.env.NETLIFY;
  const originalNodeEnv = process.env.NODE_ENV;
  const getStoreMock = jest.mocked(getStore);
  const blobStore = {
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };
  let temporaryDirectory: string | undefined;
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getStoreMock.mockReturnValue(blobStore as never);
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    delete process.env.DOCUMENT_STORAGE;
    process.env.NODE_ENV = 'test';
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    if (temporaryDirectory) {
      await rm(temporaryDirectory, { recursive: true, force: true });
      temporaryDirectory = undefined;
    }
    consoleInfoSpy.mockRestore();
  });

  afterAll(() => {
    if (originalDocumentStorage === undefined) delete process.env.DOCUMENT_STORAGE;
    else process.env.DOCUMENT_STORAGE = originalDocumentStorage;
    if (originalNetlify === undefined) delete process.env.NETLIFY;
    else process.env.NETLIFY = originalNetlify;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  });

  it('uses local filesystem storage when DOCUMENT_STORAGE is unset', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'meterflow-storage-'));
    process.chdir(temporaryDirectory);
    const service = new DocumentStorageService();
    const key = 'project-1/document.pdf';
    const data = Buffer.from('local document');

    await service.put(key, data, { originalName: 'document.pdf' });

    await expect(readFile(join(temporaryDirectory, '.local-storage', 'documents', key))).resolves.toEqual(data);
    await expect(service.get(key)).resolves.toEqual(data);
    await service.remove(key);
    await expect(service.get(key)).rejects.toBeInstanceOf(NotFoundException);
    expect(getStoreMock).not.toHaveBeenCalled();
  });

  it('uploads to Netlify Blobs with the document metadata', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'meterflow-storage-'));
    process.chdir(temporaryDirectory);
    process.env.DOCUMENT_STORAGE = 'netlify-blobs';
    process.env.NODE_ENV = 'production';
    process.env.NETLIFY = 'false';
    const service = new DocumentStorageService();
    const data = Buffer.from('blob document');
    const metadata = {
      originalName: 'document.pdf',
      mimeType: 'application/pdf',
      uploadedById: 'user-1',
    };

    await service.put('project-1/document.pdf', data, metadata);

    expect(getStoreMock).toHaveBeenCalledWith('meterflow-documents');
    expect(blobStore.set).toHaveBeenCalledWith('project-1/document.pdf', expect.any(ArrayBuffer), { metadata });
    const uploaded = blobStore.set.mock.calls[0][1] as ArrayBuffer;
    expect(Buffer.from(uploaded)).toEqual(data);
    await expect(access(join(temporaryDirectory, '.local-storage'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('downloads a document from Netlify Blobs', async () => {
    process.env.DOCUMENT_STORAGE = 'netlify-blobs';
    const value = Uint8Array.from(Buffer.from('blob document')).buffer;
    blobStore.get.mockResolvedValue(value);
    const service = new DocumentStorageService();

    await expect(service.get('project-1/document.pdf')).resolves.toEqual(Buffer.from('blob document'));
    expect(getStoreMock).toHaveBeenCalledWith('meterflow-documents');
    expect(blobStore.get).toHaveBeenCalledWith('project-1/document.pdf', { type: 'arrayBuffer' });
  });

  it('deletes a document from Netlify Blobs', async () => {
    process.env.DOCUMENT_STORAGE = 'netlify-blobs';
    const service = new DocumentStorageService();

    await service.remove('project-1/document.pdf');

    expect(getStoreMock).toHaveBeenCalledWith('meterflow-documents');
    expect(blobStore.delete).toHaveBeenCalledWith('project-1/document.pdf');
  });

  it('throws NotFoundException when a blob is missing', async () => {
    process.env.DOCUMENT_STORAGE = 'netlify-blobs';
    blobStore.get.mockResolvedValue(null);
    const service = new DocumentStorageService();

    await expect(service.get('missing.pdf')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('logs the selected driver without logging configuration values', () => {
    process.env.DOCUMENT_STORAGE = 'netlify-blobs';

    new DocumentStorageService();

    expect(consoleInfoSpy).toHaveBeenCalledWith('[DocumentStorage]', {
      driver: 'netlify-blobs',
      nodeEnv: 'test',
      documentStorageConfigured: true,
    });
  });
});
