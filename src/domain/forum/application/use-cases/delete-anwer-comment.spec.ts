import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete answer comment', () => {
    beforeEach(() => {
        inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository();
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswersCommentsRepository);
    });

    it('should delete a answer comment', async () => {
        const newAnswerComment = makeAnswerComment();
        await inMemoryAnswersCommentsRepository.create(newAnswerComment);

        const result = await sut.execute({
            authorId: newAnswerComment.authorId.toString(),
            answerCommentId: newAnswerComment.id.toString(),
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryAnswersCommentsRepository.answersComments).toHaveLength(0);
    });

    it('should not delete a answer comment if the answer comment does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            answerCommentId: 'answer-comment-1',
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not delete a answer comment if the author is not the answer comment author', async () => {
        const newAnswerComment = makeAnswerComment();
        await inMemoryAnswersCommentsRepository.create(newAnswerComment);

        const result = await sut.execute({
            authorId: 'author-2',
            answerCommentId: newAnswerComment.id.toString(),
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
