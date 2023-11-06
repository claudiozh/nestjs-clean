import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>;

@Controller('answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) body: CommentOnAnswerBody,
    @AuthUser() user: IAuthUser,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      answerId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
