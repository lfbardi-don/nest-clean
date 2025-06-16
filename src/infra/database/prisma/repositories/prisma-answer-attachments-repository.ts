import { AnswersAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswersAttachmentsRepository {
    constructor(private prisma: PrismaService) { }

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const attachments = await this.prisma.attachment.findMany({
            where: {
                answerId,
            },
        });

        return attachments.map(PrismaAnswerAttachmentMapper.toDomain);
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                answerId,
            },
        });
    }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return;
        }

        const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

        await this.prisma.attachment.updateMany(data);
    }

    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return;
        }

        const data = PrismaAnswerAttachmentMapper.toPrismaDeleteMany(attachments);

        await this.prisma.attachment.deleteMany(data);
    }
}