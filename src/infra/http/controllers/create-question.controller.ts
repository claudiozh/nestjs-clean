import { AuthUser } from '@/infra/auth/auth-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt.auth';
import { IAuthUser } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBody,
    @AuthUser() user: IAuthUser,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.generateSlug(title);

    await this.prismaService.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });
  }

  private generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
