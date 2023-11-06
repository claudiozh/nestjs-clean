import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';

@Controller('answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private readonly deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser() user: IAuthUser, @Param('id') answerCommentId: string) {
    const userId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
