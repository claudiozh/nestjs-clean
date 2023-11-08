import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';

const editAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>;

@Controller('answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswerUse: EditAnswerUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBody,
    @AuthUser() user: IAuthUser,
    @Param('id') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswerUse.execute({
      answerId,
      attachmentsIds: [],
      authorId: userId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
