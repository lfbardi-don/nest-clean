import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
    title: string;
    url: string;
}

export class Attachment extends Entity<AttachmentProps> {
    get title(): string {
        return this.props.title;
    }

    get url(): string {
        return this.props.url;
    }

    static create(props: AttachmentProps, id?: UniqueEntityId) {
        return new Attachment(props, id);
    }
}