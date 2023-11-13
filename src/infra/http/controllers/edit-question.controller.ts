import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
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

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>;

@Controller('questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBody,
    @AuthUser() user: IAuthUser,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
