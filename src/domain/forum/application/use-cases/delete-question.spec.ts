import { makeQuestion } from 'test/factories/make-question';
import { DeleteQuestionUseCase } from './delete-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete question', () => {

    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository
        );
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
    });

    it('should delete a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('question-1'));
        await inMemoryQuestionsRepository.create(newQuestion);

        inMemoryQuestionsAttachmentsRepository.questionAttachments.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('attachment-1'),
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('attachment-2'),
            }),
        );

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsRepository.questions).toHaveLength(0);
        expect(inMemoryQuestionsAttachmentsRepository.questionAttachments).toHaveLength(0);
    });

    it('should not delete a question if the question does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not delete a question if the author is not the question author', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('question-1'));
        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            authorId: 'author-2',
            questionId: 'question-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
