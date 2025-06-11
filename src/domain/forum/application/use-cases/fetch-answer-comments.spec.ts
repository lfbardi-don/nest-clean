import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository';

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
    beforeEach(() => {
        inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository();
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository);
    });

    it('should get answer comments', async () => {
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }));
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }));
        await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }));

        const result = await sut.execute({ answerId: 'answer-1', page: 1 });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.answerComments).toHaveLength(3);
    });

    it('should get recent answer comments with pagination', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }));
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.answerComments).toHaveLength(2);
    });
});
