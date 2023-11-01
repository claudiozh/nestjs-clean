import { Module } from '@nestjs/common';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-questions';

import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchQuestionsController } from '@/infra/http/controllers/fetch-questions.controller';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { GetQuestionBySlugController } from '@/infra/http/controllers/get-question-by-slug.controller';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';

@Module({
  imports: [CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchQuestionsUseCase,
    GetQuestionBySlugUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
