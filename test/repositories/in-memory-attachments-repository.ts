import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
    public attachments: Attachment[] = [];

    async create(attachment: Attachment): Promise<Attachment> {
        this.attachments.push(attachment);
        return attachment;
    }
}