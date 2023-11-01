import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcrypt';

describe('Get question by slug (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Jonh Doe',
        email: 'jonhdoe@gmail.com',
        passwordHash: await hash('123456', 8),
      },
    });

    const accessToken = jwtService.sign({
      sub: user.id,
    });

    await prismaService.question.create({
      data: {
        title: 'Question title 01',
        content: 'Question content 01',
        slug: 'question-title-01',
        authorId: user.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-title-01')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question title 01',
      }),
    });
  });
});
