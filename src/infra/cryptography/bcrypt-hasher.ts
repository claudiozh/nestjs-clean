import { hash as hashBcrypt, compare as compareBcrypt } from 'bcrypt';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_ROUNDS = 10;

  async hash(plain: string): Promise<string> {
    return hashBcrypt(plain, this.HASH_SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compareBcrypt(plain, hash);
  }
}
