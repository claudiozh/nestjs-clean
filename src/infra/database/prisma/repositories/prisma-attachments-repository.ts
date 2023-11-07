import { Injectable } from '@nestjs/common';

import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistence(attachment);

    await this.prismaService.attachment.create({
      data,
    });
  }
}
