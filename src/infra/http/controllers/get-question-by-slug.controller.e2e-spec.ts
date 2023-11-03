import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';

describe('Get question by slug (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwtService: JwtService;

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

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    const slug = Slug.create('question-title-01');

    await questionFactory.makePrismaQuestion({
      slug,
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        slug: slug.value,
      }),
    });
  });
});
