import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionsAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachments-repository';

export class InMemoryQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
    public questionAttachments: QuestionAttachment[] = [];

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