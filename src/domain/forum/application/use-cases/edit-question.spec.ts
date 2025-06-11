import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository
        );
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsAttachmentsRepository);
    });

    it('should edit a question', async () => {
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
            })
        );

        const result = await sut.execute({
            authorId: 'author-1',
            questionId: newQuestion.id.toValue(),
            title: 'New Title',
            content: 'New Content',
            attachmentsIds: ['attachment-1', 'attachment-3'],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
            title: 'New Title',
            content: 'New Content',
        });

        expect(inMemoryQuestionsRepository.questions[0].attachments.getItems()).toHaveLength(2);
        expect(inMemoryQuestionsRepository.questions[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-3') }),
        ]);
    });

    it('should not edit a question if the question does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
            title: 'title',
            content: 'content',
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not edit a question if the author is not the question author', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('question-1'));
        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            authorId: 'author-2',
            questionId: newQuestion.id.toValue(),
            title: 'New Title',
            content: 'New Content',
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
