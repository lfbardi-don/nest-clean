import { EventHandler } from "@/core/events/event-handler";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler {
    constructor(
        private questionsRepository: QuestionsRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
    }

    private async sendNewAnswerNotification({ aggregate }: AnswerCreatedEvent): Promise<void> {
        const question = await this.questionsRepository.findById(aggregate.questionId.toString());

        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: "New answer on: " + question.title.substring(0, 40).concat("..."),
                content: aggregate.excerpt,
            });
        }
    }
}
