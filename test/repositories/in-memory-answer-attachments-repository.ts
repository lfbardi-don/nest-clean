import { AnswersAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository implements AnswersAttachmentsRepository {
    public answerAttachments: AnswerAttachment[] = [];

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        return this.answerAttachments
            .filter(
                (answerAttachment) =>
                    answerAttachment.answerId.toString() === answerId
            );
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        this.answerAttachments = this.answerAttachments.filter(
            (answerAttachment) =>
                answerAttachment.answerId.toString() !== answerId
        );
    }
}
