import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { UploadParams, Uploader } from '@/domain/forum/application/storage/uploader';
import { EnvService } from '@/infra/env/env.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client;

  constructor(private readonly envService: EnvService) {
    const cloudFlareAccountId = this.envService.get('CLOUDFLARE_ACCOUNT_ID');
    const cloudFlareEndpoint = `https://${cloudFlareAccountId}.r2.cloudflarestorage.com`;

    this.client = new S3Client({
      endpoint: cloudFlareEndpoint,
      region: 'auto',
      credentials: {
        accessKeyId: this.envService.get('STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('STORAGE_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({ fileName, fileType, body }: UploadParams): Promise<{ fileKey: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('STORAGE_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    );

    return {
      fileKey: uniqueFileName,
    };
  }
}
