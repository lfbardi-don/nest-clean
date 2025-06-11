import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { makeQuestion } from "test/factories/make-question";
import { makeAnswer } from "test/factories/make-answer";
import { type MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<typeof sendNotification.execute>;

describe("OnQuestionBestAnswerChosen", () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository
        );
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository
        );
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
        sendNotification = new SendNotificationUseCase(inMemoryNotificationsRepository);

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute');

        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification);
    });

    it("should send a notification when the best answer is chosen", async () => {
        const question = makeQuestion();
        const answer = makeAnswer({ questionId: question.id });

        inMemoryQuestionsRepository.create(question);
        inMemoryAnswersRepository.create(answer);

        question.bestAnswerId = answer.id;

        inMemoryQuestionsRepository.save(question);

        await waitFor(async () => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});