import { UploadParams, Uploader } from '@/domain/forum/application/storage/uploader';
import { randomUUID } from 'node:crypto';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload(params: UploadParams): Promise<{ url: string }> {
    const uniqueKey = randomUUID();
    const url = `http://localhost:3000/${params.fileName}-${uniqueKey.toString()}}`;

    this.uploads.push({
      fileName: params.fileName,
      url,
    });

    return {
      url,
    };
  }
}
