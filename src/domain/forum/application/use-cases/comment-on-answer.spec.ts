import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: CommentOnAnswerUseCase;

describe('Comment on answer', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
        inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentsRepository(inMemoryStudentsRepository);

        sut = new CommentOnAnswerUseCase(inMemoryAnswerCommentsRepository, inMemoryAnswersRepository);
    });

    it('should comment on a answer', async () => {
        const newAnswer = makeAnswer();
        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: newAnswer.authorId.toString(),
            answerId: newAnswer.id.toString(),
            content: 'New Content',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryAnswerCommentsRepository.answersComments[0].content).toEqual('New Content');
    });

    it('should not comment on a answer if the answer does not exist', async () => {
        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
            content: 'New Content',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });
});
