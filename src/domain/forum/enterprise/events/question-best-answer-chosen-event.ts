import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
    public ocurredAt: Date;
    public aggregate: Question;
    public bestAnswerId: UniqueEntityId;

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id;
    }

    constructor(aggregate: Question, bestAnswerId: UniqueEntityId) {
        this.aggregate = aggregate;
        this.bestAnswerId = bestAnswerId;
        this.ocurredAt = new Date();
    }
}