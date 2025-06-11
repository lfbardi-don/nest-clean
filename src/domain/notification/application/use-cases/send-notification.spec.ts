import { SendNotificationUseCase } from './send-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send notification', () => {

    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
        sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
    });

    it('should send a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'title',
            content: 'content',
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryNotificationsRepository.notifications).toHaveLength(1);
        expect(inMemoryNotificationsRepository.notifications[0]).toEqual(result.value?.notification);
    });
});
