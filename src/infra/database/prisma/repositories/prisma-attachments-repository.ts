import { Injectable } from "@nestjs/common";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaService } from "../prisma.service";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
    constructor(private prisma: PrismaService) { }

    async create(attachment: Attachment): Promise<Attachment> {
        const raw = PrismaAttachmentMapper.toPrisma(attachment);

        await this.prisma.attachment.create({
            data: raw,
        });

        return attachment;
    }
}       