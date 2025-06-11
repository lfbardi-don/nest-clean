import { Injectable } from "@nestjs/common";
import { QuestionsAttachmentsRepository } from "@/domain/forum/application/repositories/questions-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionsAttachmentsRepository {
    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        throw new Error("Method not implemented.");
    }

    deleteManyByQuestionId(questionId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}       