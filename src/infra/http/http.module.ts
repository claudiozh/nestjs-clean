import { Module } from '@nestjs/common';

import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchQuestionsController } from '@/infra/http/controllers/fetch-questions.controller';

@Module({
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchQuestionsController],
})
export class HttpModule {}
