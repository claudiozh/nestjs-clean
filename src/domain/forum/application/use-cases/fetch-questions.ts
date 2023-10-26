import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchQuestionsUseCaseRequest {
  page: number;
}

type FetchQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ page }: FetchQuestionsUseCaseRequest): Promise<FetchQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
