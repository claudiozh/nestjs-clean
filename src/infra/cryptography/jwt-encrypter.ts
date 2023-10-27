import { JwtService } from '@nestjs/jwt';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
