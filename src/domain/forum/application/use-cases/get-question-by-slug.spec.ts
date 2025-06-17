import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get question by slug', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository
        );
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
    });

    it('should get a question by slug', async () => {
        const newStudent = makeStudent();
        inMemoryStudentsRepository.students.push(newStudent);

        const newQuestion = makeQuestion({
            slug: Slug.create('example-question'),
            authorId: newStudent.id,
        });
        await inMemoryQuestionsRepository.create(newQuestion);

        const attachment = makeAttachment();
        inMemoryAttachmentsRepository.attachments.push(attachment);

        const questionAttachment = makeQuestionAttachment({
            attachmentId: attachment.id,
            questionId: newQuestion.id,
        });
        inMemoryQuestionsAttachmentsRepository.questionAttachments.push(questionAttachment);

        const result = await sut.execute({
            slug: 'example-question',
        });

        expect(result.isRight()).toBeTruthy();

        if (result.isRight()) {
            expect(result.value.question.questionId).toBeTruthy();
            expect(result.value.question.title).toBe(newQuestion.title);
            expect(result.value.question.author).toBe(newStudent.name);
            expect(result.value.question.content).toBe(newQuestion.content);
            expect(result.value.question.attachments).toHaveLength(1);
            expect(result.value.question.attachments[0].id.toString()).toBe(attachment.id.toString());
        }
    });
});
