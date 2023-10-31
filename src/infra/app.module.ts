import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/infra/env/env-schema';
import { AuthModule } from '@/infra/auth/auth.module';
import { HttpModule } from '@/infra/http/http.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    HttpModule,
    CryptographyModule,
    EnvModule,
  ],
  controllers: [],
})
export class AppModule {}
