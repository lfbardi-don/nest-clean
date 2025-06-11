import { ReadNotificationUseCase } from './read-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makeNotification } from 'test/factories/make-notification';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read notification', () => {

    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
        sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
    });

    it('should read a notification', async () => {
        const notification = makeNotification();
        inMemoryNotificationsRepository.create(notification);


        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: notification.recipientId.toString(),
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(expect.any(Date));
    });

    it('should not read a notification if it does not exist', async () => {
        const result = await sut.execute({
            notificationId: '1',
            recipientId: '1',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not read a notification if the recipient is not the owner', async () => {
        const notification = makeNotification();
        inMemoryNotificationsRepository.create(notification);

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: '2',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
});
