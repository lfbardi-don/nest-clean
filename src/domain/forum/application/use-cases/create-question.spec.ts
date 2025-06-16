import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question', () => {

    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository
        );
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
    });

    it('should create a question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: 'title',
            content: 'content',
            attachmentsIds: ['1', '2'],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsRepository.questions).toHaveLength(1);
        expect(inMemoryQuestionsRepository.questions[0].attachments.getItems()).toHaveLength(2);
        expect(inMemoryQuestionsRepository.questions[0].attachments.getItems()).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
        ]);
    });

    it('should persist attachments when creating new question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: 'title',
            content: 'content',
            attachmentsIds: ['1', '2'],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsAttachmentsRepository.questionAttachments).toHaveLength(2);
        expect(inMemoryQuestionsAttachmentsRepository.questionAttachments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
                expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
            ])
        );
    });
});
