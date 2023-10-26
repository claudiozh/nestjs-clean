import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';

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
    const result = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items.length).toBe(1);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
  });
});
