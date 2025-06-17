import { makeQuestion } from 'test/factories/make-question';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository
        );
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository(
            inMemoryStudentsRepository
        );

        sut = new CommentOnQuestionUseCase(inMemoryQuestionsCommentsRepository, inMemoryQuestionsRepository);
    });

    it('should comment on a question', async () => {
        const newQuestion = makeQuestion();
        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            authorId: newQuestion.authorId.toString(),
            questionId: newQuestion.id.toString(),
            content: 'New Content',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsCommentsRepository.questionsComments[0].content).toEqual('New Content');

    });

    it('should not comment on a question if the question does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            questionId: 'question-1',
            content: 'New Content',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });
});
