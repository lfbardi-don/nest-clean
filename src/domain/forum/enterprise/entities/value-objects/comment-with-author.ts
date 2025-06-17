import { ValueObject } from "@/core/entities/value-object";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface CommentWithAuthorProps {
    commentId: UniqueEntityId;
    content: string;
    authorId: UniqueEntityId;
    author: string;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {

    get commentId(): UniqueEntityId {
        return this.props.commentId;
    }

    get content(): string {
        return this.props.content;
    }

    get authorId(): UniqueEntityId {
        return this.props.authorId;
    }

    get author(): string {
        return this.props.author;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date | null {
        return this.props.updatedAt || null;
    }

    static create(props: CommentWithAuthorProps): CommentWithAuthor {
        return new CommentWithAuthor(props);
    }
}
