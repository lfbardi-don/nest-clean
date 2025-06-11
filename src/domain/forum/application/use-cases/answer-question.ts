import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';

interface AnswerQuestionUseCaseProps {
  questionId: string
  instructorId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questionId,
    instructorId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseProps): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(instructorId),
    });

    answer.attachments = new AnswerAttachmentList(
      attachmentsIds.map((attachmentId) => {
        return AnswerAttachment.create({
          attachmentId: new UniqueEntityId(attachmentId),
          answerId: answer.id,
        });
      }),
    );

    await this.answersRepository.create(answer);
    return right({ answer });
  }
}
