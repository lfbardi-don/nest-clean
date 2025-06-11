import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event';

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get bestAnswerId(): UniqueEntityId | null {
    return this.props.bestAnswerId || null;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get slug(): Slug {
    return this.props.slug;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt || null;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') < 3;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.fromString(title);

    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | null | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId));
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ): Question {
    return new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.fromString(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    );
  }
}
