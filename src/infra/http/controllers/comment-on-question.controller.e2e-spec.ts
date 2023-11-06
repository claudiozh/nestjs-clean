import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';

describe('Comment on question (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id;

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .send({
        content: 'New content',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(201);

    const commentOnDatabase = await prismaService.comment.findFirst({
      where: {
        content: 'New content',
      },
    });

    expect(commentOnDatabase).toBeTruthy();
  });
});
