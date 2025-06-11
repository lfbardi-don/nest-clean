import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface QuestionAttachmentProps {
    attachmentId: UniqueEntityId;
    questionId: UniqueEntityId;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
    get attachmentId(): UniqueEntityId {
        return this.props.attachmentId;
    }

    get questionId(): UniqueEntityId {
        return this.props.questionId;
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
        return new QuestionAttachment(props, id);
    }
}   