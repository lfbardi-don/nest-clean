import { QuestionAttachmentProps, QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {}, id?: UniqueEntityId) {
    return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        ...override,
    }, id);
}

@Injectable()
export class QuestionAttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
        const questionAttachment = makeQuestionAttachment(data);

        await this.prisma.attachment.update({
            where: {
                id: questionAttachment.attachmentId.toString(),
            },
            data: {
                questionId: questionAttachment.questionId.toString(),
            },
        });

        return questionAttachment;
    }
}