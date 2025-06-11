import { DomainEvent } from "@/core/events/domain-event";
import { Answer } from "../entities/answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class AnswerCreatedEvent implements DomainEvent {
    public ocurredAt: Date;
    public aggregate: Answer;

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id;
    }

    constructor(aggregate: Answer) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }
}