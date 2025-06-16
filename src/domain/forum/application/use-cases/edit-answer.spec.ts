import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit answer', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
        sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
    });

    it('should edit a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('answer-1'));

        await inMemoryAnswersRepository.create(newAnswer);

        inMemoryAnswerAttachmentsRepository.answerAttachments.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('attachment-1'),
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('attachment-2'),
            }),
        );

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: newAnswer.id.toValue(),
            content: 'New Content',
            attachmentsIds: ['attachment-1', 'attachment-3'],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
            content: 'New Content',
        });

        expect(inMemoryAnswersRepository.answers[0].attachments.getItems()).toHaveLength(2);
        expect(inMemoryAnswersRepository.answers[0].attachments.getItems()).toEqual([
            expect.objectContaining({
                attachmentId: expect.objectContaining({
                    value: 'attachment-1',
                }),
            }),
            expect.objectContaining({
                attachmentId: expect.objectContaining({
                    value: 'attachment-3',
                }),
            }),
        ]);
    });

    it('should not edit a answer if the answer does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
            content: 'content',
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not edit a answer if the author is not the answer author', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('answer-1'));
        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: newAnswer.id.toValue(),
            content: 'New Content',
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });

    it('should sync new and removed attachments when editing answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1'),
        }, new UniqueEntityId('answer-1'));

        await inMemoryAnswersRepository.create(newAnswer);

        inMemoryAnswerAttachmentsRepository.answerAttachments.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('attachment-1'),
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('attachment-2'),
            })
        );

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: newAnswer.id.toString(),
            content: 'New Content',
            attachmentsIds: ['attachment-1', 'attachment-3'],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(2);
        expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-1') }),
                expect.objectContaining({ attachmentId: new UniqueEntityId('attachment-3') }),
            ])
        );
    });
});
