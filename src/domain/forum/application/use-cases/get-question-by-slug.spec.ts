import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get question by slug', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository
        );
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
    });

    it('should get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('example-question'),
        });
        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            slug: 'example-question',
        });

        expect(result.isRight()).toBeTruthy();

        if (result.isRight()) {
            expect(result.value.question.id).toBeTruthy();
            expect(newQuestion.title).toBe(result.value.question.title);
        }
    });
});
