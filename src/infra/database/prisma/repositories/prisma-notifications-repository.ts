
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notification-repository";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async create(notification: Notification): Promise<void> {
        const data = PrismaNotificationMapper.toPrisma(notification);

        await this.prisma.notification.create({
            data,
        });
    }

    async save(notification: Notification): Promise<void> {
        const data = PrismaNotificationMapper.toPrisma(notification);

        await this.prisma.notification.update({
            where: {
                id: data.id,
            },
            data,
        });
    }

    async findById(id: string): Promise<Notification | null> {
        const notification = await this.prisma.notification.findUnique({
            where: {
                id,
            },
        });

        if (!notification) {
            return null;
        }

        return PrismaNotificationMapper.toDomain(notification);
    }
}