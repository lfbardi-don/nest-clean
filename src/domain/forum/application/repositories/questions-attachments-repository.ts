import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export abstract class QuestionsAttachmentsRepository {
    abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
    abstract deleteManyByQuestionId(questionId: string): Promise<void>;
    abstract createMany(attachments: QuestionAttachment[]): Promise<void>;
    abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>;
}
