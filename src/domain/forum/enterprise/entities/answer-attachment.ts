import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AnswerAttachmentProps {
    attachmentId: UniqueEntityId;
    answerId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
    get attachmentId(): UniqueEntityId {
        return this.props.attachmentId;
    }

    get answerId(): UniqueEntityId {
        return this.props.answerId;
    }

    static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
        return new AnswerAttachment(props, id);
    }
}
