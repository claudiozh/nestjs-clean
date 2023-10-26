import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await this.prismaService.question.create({
      data,
    });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await this.prismaService.question.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(question: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }
}
