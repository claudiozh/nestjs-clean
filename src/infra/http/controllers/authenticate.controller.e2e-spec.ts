import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    const user = {
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    };

    await prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: await hash(user.password, 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
  });
});
