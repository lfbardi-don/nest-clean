import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "@/core/errors/errors/unauthorized-error";
import { Injectable } from "@nestjs/common";

interface ReadNotificationUseCaseProps {
    notificationId: string;
    recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    {
        notification: Notification;
    }
>;

@Injectable()
export class ReadNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) { }

    async execute({
        notificationId,
        recipientId,
    }: ReadNotificationUseCaseProps): Promise<ReadNotificationUseCaseResponse> {
        const notification = await this.notificationsRepository.findById(notificationId);

        if (!notification) {
            return left(new ResourceNotFoundError());
        }

        if (notification.recipientId.toString() !== recipientId) {
            return left(new UnauthorizedError());
        }

        notification.read();
        await this.notificationsRepository.save(notification);

        return right({ notification });
    }
}
