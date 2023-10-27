import { Module } from '@nestjs/common';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-questions';

import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchQuestionsController } from '@/infra/http/controllers/fetch-questions.controller';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';

@Module({
  imports: [CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchQuestionsController],
  providers: [CreateQuestionUseCase, FetchQuestionsUseCase, AuthenticateStudentUseCase],
})
export class HttpModule {}
