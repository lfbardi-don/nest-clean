import { NotificationProps, Notification } from "@/domain/notification/enterprise/entities/notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
    return Notification.create({
        recipientId: new UniqueEntityId(),
        title: faker.lorem.sentence(4),
        content: faker.lorem.sentence(10),
        ...override,
    }, id);
}

@Injectable()
export class NotificationFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification> {
        const notification = makeNotification(data);

        await this.prisma.notification.create({
            data: PrismaNotificationMapper.toPrisma(notification),
        });

        return notification;
    }
}