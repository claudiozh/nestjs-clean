import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Comment as PrismaQuestionComment, Prisma } from '@prisma/client';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaQuestionComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Question comment must have an answerId.');
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      questionId: questionComment.questionId.toString(),
      authorId: questionComment.authorId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
