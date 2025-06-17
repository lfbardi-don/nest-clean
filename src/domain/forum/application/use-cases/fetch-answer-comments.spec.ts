import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository(inMemoryStudentsRepository);
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository);
    });

    it('should get answer comments', async () => {
        const student = makeStudent();
        inMemoryStudentsRepository.students.push(student);

        await inMemoryAnswersCommentsRepository.create(
            makeAnswerComment({ answerId: new UniqueEntityId('answer-1'), authorId: student.id })
        );
        await inMemoryAnswersCommentsRepository.create(
            makeAnswerComment({ answerId: new UniqueEntityId('answer-1'), authorId: student.id })
        );
        await inMemoryAnswersCommentsRepository.create(
            makeAnswerComment({ answerId: new UniqueEntityId('answer-1'), authorId: student.id })
        );

        const result = await sut.execute({ answerId: 'answer-1', page: 1 });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.comments).toHaveLength(3);
        expect(result.value?.comments[0].author).toBe(student.name);
        expect(result.value?.comments[1].author).toBe(student.name);
        expect(result.value?.comments[2].author).toBe(student.name);
    });

    it('should get recent answer comments with pagination', async () => {
        const student = makeStudent();
        inMemoryStudentsRepository.students.push(student);

        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersCommentsRepository.create(
                makeAnswerComment({ answerId: new UniqueEntityId('answer-1'), authorId: student.id })
            );
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.comments).toHaveLength(2);
        expect(result.value?.comments[0].author).toBe(student.name);
        expect(result.value?.comments[1].author).toBe(student.name);
    });
});
