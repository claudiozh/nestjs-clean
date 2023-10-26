import { Module } from '@nestjs/common';

import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchQuestionsController } from '@/infra/http/controllers/fetch-questions.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-questions';

@Module({
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchQuestionsController],
  providers: [CreateQuestionUseCase, FetchQuestionsUseCase],
})
export class HttpModule {}
