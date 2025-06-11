
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeleteAnswerUseCase } from './delete-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository
        );
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
    });

    it('should delete a question', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('answer-1'));
        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryAnswersRepository.answers).toHaveLength(0);
    });

    it('should not delete a question if the question does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not delete a question if the author is not the question author', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('answer-1'));
        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: 'answer-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
