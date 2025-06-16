import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityId) {
    return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(),
        answerId: new UniqueEntityId(),
        ...override,
    }, id);
}

@Injectable()
export class AnswerAttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
        const answerAttachment = makeAnswerAttachment(data);

        await this.prisma.attachment.update({
            where: {
                id: answerAttachment.attachmentId.toString(),
            },
            data: {
                answerId: answerAttachment.answerId.toString(),
            },
        });

        return answerAttachment;
    }
}