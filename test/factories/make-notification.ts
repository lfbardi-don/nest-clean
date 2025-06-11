import { NotificationProps, Notification } from "@/domain/notification/enterprise/entities/notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
    return Notification.create({
        recipientId: new UniqueEntityId(),
        title: faker.lorem.sentence(4),
        content: faker.lorem.sentence(10),
        ...override,
    }, id);
}