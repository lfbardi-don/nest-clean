import { makeQuestion } from 'test/factories/make-question';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose question best answer', () => {

    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository
        );

        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
        sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository);
    });

    it('should choose a question best answer', async () => {
        const newQuestion = makeQuestion();
        await inMemoryQuestionsRepository.create(newQuestion);

        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
        });

        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: newQuestion.authorId.toString(),
            answerId: newAnswer.id.toString(),
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toEqual(newAnswer.id);

    });

    it('should not choose a question best answer if the question does not exist', async () => {
        const newAnswer = makeAnswer();
        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: newAnswer.id.toString(),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not choose a question best answer if the answer does not exist', async () => {
        const newQuestion = makeQuestion();
        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not choose a question best answer if the author is not the question author', async () => {
        const newQuestion = makeQuestion();
        await inMemoryQuestionsRepository.create(newQuestion);

        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
        });

        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: newAnswer.id.toString(),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
