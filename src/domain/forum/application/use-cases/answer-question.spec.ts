import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.answers[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.answers[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ],
    );
  });

  it('should persist attachments when creating new answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(2);
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ])
    );
  });
});