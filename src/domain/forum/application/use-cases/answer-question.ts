import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseProps {
  questionId: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questionId,
    authorId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseProps): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(authorId),
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
