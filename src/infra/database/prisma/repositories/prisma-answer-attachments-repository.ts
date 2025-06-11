import { AnswersAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswersAttachmentsRepository {
    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        throw new Error("Method not implemented.");
    }

    deleteManyByAnswerId(answerId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}