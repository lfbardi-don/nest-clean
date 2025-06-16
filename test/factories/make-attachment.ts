import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";
import { AttachmentProps, Attachment } from "@/domain/forum/enterprise/entities/attachment";

export function makeAttachment(override: Partial<AttachmentProps> = {}, id?: UniqueEntityId) {
    return Attachment.create({
        title: faker.lorem.slug(),
        url: faker.internet.url(),
        ...override,
    }, id);
}

@Injectable()
export class AttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
        const attachment = makeAttachment(data);

        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment),
        });

        return attachment;
    }
}