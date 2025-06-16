import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaQuestionAttachmentMapper {
    static toDomain(raw: PrismaAttachment): QuestionAttachment {
        if (!raw.questionId) {
            throw new Error("Invalid question attachment");
        }

        return QuestionAttachment.create({
            attachmentId: new UniqueEntityId(raw.id),
            questionId: new UniqueEntityId(raw.questionId),
        }, new UniqueEntityId(raw.id));
    }

    static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map((attachment) => attachment.attachmentId.toString());
        const questionId = attachments[0].questionId.toString();

        return {
            where: {
                id: {
                    in: attachmentIds,
                }
            },
            data: {
                questionId,
            }
        };
    }

    static toPrismaDeleteMany(attachments: QuestionAttachment[]): Prisma.AttachmentDeleteManyArgs {
        const attachmentIds = attachments.map((attachment) => attachment.attachmentId.toString());

        return {
            where: {
                id: {
                    in: attachmentIds,
                }
            }
        };
    }
}   