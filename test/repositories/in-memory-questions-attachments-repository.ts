import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionsAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachments-repository';

export class InMemoryQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
    public questionAttachments: QuestionAttachment[] = [];

    async createMany(attachments: QuestionAttachment[]): Promise<void> {
        this.questionAttachments.push(...attachments);
    }

    async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
        this.questionAttachments = this.questionAttachments.filter(
            (questionAttachment) =>
                !attachments.some((attachment) => attachment.equals(questionAttachment))
        );
    }

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        return this.questionAttachments
            .filter(
                (questionAttachment) =>
                    questionAttachment.questionId.toString() === questionId
            );
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        this.questionAttachments = this.questionAttachments.filter(
            (questionAttachment) =>
                questionAttachment.questionId.toString() !== questionId
        );
    }
}