import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPersistence(student);

    await this.prismaService.user.create({
      data,
    });
  }
}
