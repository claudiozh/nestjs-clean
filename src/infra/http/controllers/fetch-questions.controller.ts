import { FetchQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-questions';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { QuestionPresenter } from '@/infra/http/presenters/question-presenter';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('questions')
export class FetchQuestionsController {
  constructor(private readonly fetchQuestionsUseCase: FetchQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchema) {
    const result = await this.fetchQuestionsUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new Error('Something went wrong');
    }

    const questions = result.value.questions.map(QuestionPresenter.toHttp);

    return {
      questions,
    };
  }
}
