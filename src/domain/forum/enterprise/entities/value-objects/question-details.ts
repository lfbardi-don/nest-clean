import { ValueObject } from "@/core/entities/value-object";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

export interface QuestionDetailsProps {
    questionId: UniqueEntityId;
    authorId: UniqueEntityId;
    author: string;
    title: string;
    slug: Slug
    content: string;
    attachments: Attachment[];
    bestAnswerId?: UniqueEntityId | null;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {

    get questionId(): UniqueEntityId {
        return this.props.questionId;
    }

    get authorId(): UniqueEntityId {
        return this.props.authorId;
    }

    get author(): string {
        return this.props.author;
    }

    get title(): string {
        return this.props.title;
    }

    get slug(): Slug {
        return this.props.slug;
    }

    get content(): string {
        return this.props.content;
    }

    get attachments(): Attachment[] {
        return this.props.attachments;
    }

    get bestAnswerId(): UniqueEntityId | null {
        return this.props.bestAnswerId || null;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date | null {
        return this.props.updatedAt || null;
    }

    static create(props: QuestionDetailsProps): QuestionDetails {
        return new QuestionDetails(props);
    }
}
