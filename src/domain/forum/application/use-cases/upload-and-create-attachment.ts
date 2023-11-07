import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { InvalidAttachmentError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type-error';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Uploader } from '@/domain/forum/application/storage/uploader';

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(private readonly attachmentsRepository: AttachmentsRepository, private readonly uploader: Uploader) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const regexMimeType = /^image\/(png|jpg|jpeg|pdf)$/;

    if (!regexMimeType.test(fileType)) {
      return left(new InvalidAttachmentError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
