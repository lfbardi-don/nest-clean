import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments.repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch questions comments', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository(inMemoryStudentsRepository);
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository);
    });

    it('should get questions comments', async () => {
        const student = makeStudent();
        inMemoryStudentsRepository.students.push(student);

        await inMemoryQuestionsCommentsRepository.create(
            makeQuestionComment({ questionId: new UniqueEntityId('question-1'), authorId: student.id })
        );

        await inMemoryQuestionsCommentsRepository.create(
            makeQuestionComment({ questionId: new UniqueEntityId('question-1'), authorId: student.id })
        );
        await inMemoryQuestionsCommentsRepository.create(
            makeQuestionComment({ questionId: new UniqueEntityId('question-1'), authorId: student.id })
        );

        const result = await sut.execute({ questionId: 'question-1', page: 1 });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.comments).toHaveLength(3);
        expect(result.value?.comments[0].author).toBe(student.name);
        expect(result.value?.comments[1].author).toBe(student.name);
        expect(result.value?.comments[2].author).toBe(student.name);
    });

    it('should get recent questions comments with pagination', async () => {
        const student = makeStudent();
        inMemoryStudentsRepository.students.push(student);

        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsCommentsRepository.create(
                makeQuestionComment({ questionId: new UniqueEntityId('question-1'), authorId: student.id })
            );
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.comments).toHaveLength(2);
        expect(result.value?.comments[0].author).toBe(student.name);
        expect(result.value?.comments[1].author).toBe(student.name);
    });
});
