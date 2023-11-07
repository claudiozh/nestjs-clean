import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { StudentFactory } from 'test/factories/make-student';
import { AppModule } from '@/infra/app.module';

describe('Upload attachments (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/files/sample-upload.jpg');

    expect(response.statusCode).toBe(201);
  });
});
