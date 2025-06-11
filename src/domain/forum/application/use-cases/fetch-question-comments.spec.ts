import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments.repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch questions comments', () => {
    beforeEach(() => {
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository();
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository);
    });

    it('should get questions comments', async () => {
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-1') }));
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-1') }));
        await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-1') }));

        const result = await sut.execute({ questionId: 'question-1', page: 1 });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.questionComments).toHaveLength(3);
    });

    it('should get recent questions comments with pagination', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-1') }));
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.questionComments).toHaveLength(2);
    });
});
