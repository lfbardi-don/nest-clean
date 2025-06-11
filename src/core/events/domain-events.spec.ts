import { AggregateRoot } from "../entities/aggregate-root";
import { DomainEvent } from "./domain-event";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: CustomAggregate;

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id;
    }

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}

describe("Domain events", () => {
    it("should dispatch events and listen to them", () => {
        const callbackSpy = vi.fn();

        DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

        const aggregate = CustomAggregate.create();

        expect(aggregate.domainEvents).toHaveLength(1);

        DomainEvents.dispatchEventsForAggregate(aggregate.id);

        expect(callbackSpy).toHaveBeenCalled();
        expect(aggregate.domainEvents).toHaveLength(0);
    });
});