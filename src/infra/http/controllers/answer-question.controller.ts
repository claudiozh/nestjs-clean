import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>;

@Controller('questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBody,
    @AuthUser() user: IAuthUser,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      authorId: userId,
      questionId,
      attachmentsIds: [],
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
