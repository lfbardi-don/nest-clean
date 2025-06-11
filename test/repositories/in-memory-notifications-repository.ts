import { NotificationsRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationsRepository {
    public notifications: Notification[] = [];

    async create(notification: Notification): Promise<void> {
        this.notifications.push(notification);
    }

    async findById(notificationId: string): Promise<Notification | null> {
        return this.notifications.find(
            (notification) => notification.id.toString() === notificationId,
        ) || null;
    }

    async save(notification: Notification): Promise<void> {
        const notificationIndex = this.notifications.findIndex(
            (notification) => notification.id === notification.id,
        );
        this.notifications[notificationIndex] = notification;
    }
}
