import { Injectable } from "@nestjs/common";
import { QuestionsAttachmentsRepository } from "@/domain/forum/application/repositories/questions-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionsAttachmentsRepository {
    constructor(private prisma: PrismaService) { }

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const attachments = await this.prisma.attachment.findMany({
            where: {
                questionId,
            },
        });

        return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                questionId,
            },
        });
    }
}       