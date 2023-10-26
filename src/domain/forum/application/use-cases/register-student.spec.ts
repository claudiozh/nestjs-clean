import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to register student', async () => {
    const student = makeStudent();
    const result = await sut.execute(student);

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items.length).toBe(1);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const student = makeStudent();
    const result = await sut.execute(student);

    const hashedPassword = await fakeHasher.hash(student.password);

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
  });
});
