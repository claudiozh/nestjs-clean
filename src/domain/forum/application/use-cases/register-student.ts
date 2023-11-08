import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { Student } from '@/domain/forum/enterprise/entities/student';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(
      email,
    );

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      passwordHash,
    });

    await this.studentsRepository.create(student);

    return right({
      student,
    });
  }
}
