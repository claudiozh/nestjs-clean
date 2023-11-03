import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;

  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'Question title',
        content: 'Question content',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: 'Question title',
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
