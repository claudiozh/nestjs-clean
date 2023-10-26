import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionRepository } from '@/infra/database/prisma/repositories/prisma-questions-repository';
import { PrismaQuestionCommentsRepository } from '@/infra/database/prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionAttachmentRepository } from '@/infra/database/prisma/repositories/prisma-question-attachments-repository';
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers-repository';
import { PrismaAnswerCommentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
