import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-questions-comments.repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete question comment', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionsCommentsRepository(inMemoryStudentsRepository);
        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentsRepository);
    });

    it('should delete a question comment', async () => {
        const newQuestionComment = makeQuestionComment();
        await inMemoryQuestionsCommentsRepository.create(newQuestionComment);

        const result = await sut.execute({
            authorId: newQuestionComment.authorId.toString(),
            questionCommentId: newQuestionComment.id.toString(),
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsCommentsRepository.questionsComments).toHaveLength(0);
    });

    it('should not delete a question comment if the question comment does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            questionCommentId: 'question-comment-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not delete a question comment if the author is not the question comment author', async () => {
        const newQuestionComment = makeQuestionComment();
        await inMemoryQuestionsCommentsRepository.create(newQuestionComment);

        const result = await sut.execute({
            authorId: 'author-2',
            questionCommentId: newQuestionComment.id.toString(),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
