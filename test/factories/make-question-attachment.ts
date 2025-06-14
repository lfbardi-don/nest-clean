import { QuestionAttachmentProps, QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {}, id?: UniqueEntityId) {
    return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        ...override,
    }, id);
}

