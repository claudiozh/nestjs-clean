import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    const user = {
      email: 'jonhdoe@gmail.com',
      password: '123456',
    };

    await studentFactory.makePrismaStudent({
      email: user.email,
      passwordHash: await hash(user.password, 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
  });
});
