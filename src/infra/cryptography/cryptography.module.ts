import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';

import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';

@Module({
  providers: [
    {
      useClass: JwtEncrypter,
      provide: Encrypter,
    },
    {
      useClass: BcryptHasher,
      provide: HashComparer,
    },
    {
      useClass: BcryptHasher,
      provide: HashGenerator,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
