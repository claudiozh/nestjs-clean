import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/database/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcrypt';

describe('Create question (E2E)', () => {
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

  test('[POST] /questions', async () => {
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
