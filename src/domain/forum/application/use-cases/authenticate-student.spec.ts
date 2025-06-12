import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { makeStudent } from 'test/factories/make-student';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Authenticate student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher();
        fakeEncrypter = new FakeEncrypter();

        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
    });

    it('should authenticate a student', async () => {
        const student = makeStudent({
            email: 'john.doe@example.com',
            password: await fakeHasher.hash('123456'),
        });

        inMemoryStudentsRepository.students.push(student);

        const result = await sut.execute({
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({ accessToken: expect.any(String) });
    });

    it('should not authenticate a student with invalid email', async () => {
        const result = await sut.execute({
            email: 'john@example.com',
            password: '123456',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not authenticate a student with invalid password', async () => {
        const student = makeStudent({
            email: 'john.doe@example.com',
            password: await fakeHasher.hash('123456'),
        });

        inMemoryStudentsRepository.students.push(student);

        const result = await sut.execute({
            email: 'john.doe@example.com',
            password: '1234567',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(InvalidCredentialsError);
    });
});
