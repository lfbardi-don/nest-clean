import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaAnswerAttachmentMapper {
    static toDomain(raw: PrismaAttachment): AnswerAttachment {
        if (!raw.answerId) {
            throw new Error("Invalid answer attachment");
        }

        return AnswerAttachment.create({
            attachmentId: new UniqueEntityId(raw.id),
            answerId: new UniqueEntityId(raw.answerId),
        }, new UniqueEntityId(raw.id));
    }

    static toPrismaUpdateMany(attachments: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map((attachment) => attachment.attachmentId.toString());
        const answerId = attachments[0].answerId.toString();

        return {
            where: {
                id: {
                    in: attachmentIds,
                }
            },
            data: {
                answerId,
            }
        };
    }

    static toPrismaDeleteMany(attachments: AnswerAttachment[]): Prisma.AttachmentDeleteManyArgs {
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