import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    await Promise.all([
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 01' }),
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 02' }),
    ]);

    const response = await request(app.getHttpServer()).get('/questions').set('Authorization', `Bearer ${accessToken}`);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: 'Question 01',
        }),
        expect.objectContaining({
          title: 'Question 02',
        }),
      ]),
    });
  });
});
