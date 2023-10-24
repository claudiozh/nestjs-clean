import { PrismaService } from '@/database/prisma.service';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('questions')
export class FetchQuestionsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchema) {
    const perPage = 20;

    const questions = await this.prismaService.question.findMany({
      take: perPage,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      questions,
    };
  }
}
