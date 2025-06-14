import { Attachment as PrismaAttachment } from "@prisma/client";
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
}   