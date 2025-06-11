import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch recent questions', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository
        );
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
    });

    it('should get recent questions', async () => {
        const newQuestion = makeQuestion({ createdAt: new Date(2025, 5, 2) });
        const newQuestion2 = makeQuestion({ createdAt: new Date(2025, 5, 1) });
        const newQuestion3 = makeQuestion({ createdAt: new Date(2025, 5, 3) });

        await inMemoryQuestionsRepository.create(newQuestion);
        await inMemoryQuestionsRepository.create(newQuestion2);
        await inMemoryQuestionsRepository.create(newQuestion3);

        const result = await sut.execute({
            page: 1,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: newQuestion3.createdAt }),
            expect.objectContaining({ createdAt: newQuestion.createdAt }),
            expect.objectContaining({ createdAt: newQuestion2.createdAt }),
        ]);
    });

    it('should get recent questions with pagination', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2025, 5, i) }));
        }

        const result = await sut.execute({
            page: 2,
        });

        expect(result.isRight()).toBeTruthy();
        expect(result.value?.questions).toHaveLength(2);
    });
});
