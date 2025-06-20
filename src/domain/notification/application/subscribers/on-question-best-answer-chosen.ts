import { EventHandler } from "@/core/events/event-handler";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { DomainEvents } from "@/core/events/domain-events";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private answersRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(this.sendBestAnswerNotification.bind(this), QuestionBestAnswerChosenEvent.name);
    }

    private async sendBestAnswerNotification({ aggregate, bestAnswerId }: QuestionBestAnswerChosenEvent): Promise<void> {
        const answer = await this.answersRepository.findById(bestAnswerId.toString());

        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: "Your answer was chosen as the best answer!",
                content: `Your answer on: ${aggregate.title.substring(0, 20).concat("...")} was chosen by the author.`,
            });
        }
    }
}
