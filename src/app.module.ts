import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { CreateAccountController } from '@/controllers/create-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/env';
import { AuthModule } from '@/auth/auth.module';
import { AuthenticateController } from '@/controllers/authenticate.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [],
})
export class AppModule {}
