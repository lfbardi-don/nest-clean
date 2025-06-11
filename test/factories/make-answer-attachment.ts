import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityId) {
    return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(),
        answerId: new UniqueEntityId(),
        ...override,
    }, id);
}