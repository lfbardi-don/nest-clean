import { OnAnswerCreated } from "./on-answer-created";
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
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<typeof sendNotification.execute>;

describe("OnAnswerCreated", () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository
        );
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository();
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionsAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository
        );
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
        sendNotification = new SendNotificationUseCase(inMemoryNotificationsRepository);

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute');

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification);
    });

    it("should send a notification when an answer is created", async () => {
        const question = makeQuestion();
        const answer = makeAnswer({ questionId: question.id });

        inMemoryQuestionsRepository.create(question);
        inMemoryAnswersRepository.create(answer);

        await waitFor(async () => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});