import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher();

        sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
    });

    it('should register a student', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryStudentsRepository.students).toHaveLength(1);
        expect(result.value).toEqual(inMemoryStudentsRepository.students[0]);
    });

    it('should hash student password on register', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        const hashedPassword = await fakeHasher.hash('123456');

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryStudentsRepository.students[0].password).toEqual(hashedPassword);
    });

    it('should not register a student with same email', async () => {
        await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        const result = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(inMemoryStudentsRepository.students).toHaveLength(1);
        expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
    });
});
