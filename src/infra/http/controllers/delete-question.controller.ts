import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

@Controller('questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser() user: IAuthUser, @Param('id') questionId: string) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
