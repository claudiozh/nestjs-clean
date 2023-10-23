import { AuthUser } from '@/auth/auth-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt.auth';
import { IAuthUser } from '@/auth/jwt.strategy';
import { PrismaService } from '@/database/prisma.service';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async handle(@AuthUser() user: IAuthUser) {
    console.log(user);

    return {
      ok: true,
    };
  }
}
