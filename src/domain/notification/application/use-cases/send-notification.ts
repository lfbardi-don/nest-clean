import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notification-repository";
import { Injectable } from "@nestjs/common";

export interface SendNotificationUseCaseProps {
    recipientId: string;
    title: string;
    content: string;
}

export type SendNotificationUseCaseResponse = Either<
    null,
    {
        notification: Notification;
    }
>;

@Injectable()
export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) { }

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityId(recipientId),
            title,
            content,
        });

        await this.notificationsRepository.create(notification);
        return right({ notification });
    }
}
