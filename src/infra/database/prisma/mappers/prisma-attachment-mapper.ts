import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaAttachmentMapper {
    static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        };
    }

    static toDomain(raw: PrismaAttachment): Attachment {
        return Attachment.create({
            title: raw.title,
            url: raw.url,
        }, new UniqueEntityId(raw.id));
    }
}   