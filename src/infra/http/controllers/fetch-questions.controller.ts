import { FetchQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-questions';
import { ZodValidationPipe } from '@/infra/pipes/zod-validation.pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('questions')
export class FetchQuestionsController {
  constructor(private readonly fetchQuestionsUseCase: FetchQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchema) {
    const questions = await this.fetchQuestionsUseCase.execute({
      page,
    });

    return {
      questions,
    };
  }
}
