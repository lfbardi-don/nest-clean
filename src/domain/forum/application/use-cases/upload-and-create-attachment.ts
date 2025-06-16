
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";

interface UploadAndCreateAttachmentUseCaseProps {
    fileName: string;
    fileType: string;
    fileBuffer: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<InvalidAttachmentTypeError, Attachment>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(private attachmentsRepository: AttachmentsRepository, private uploader: Uploader) { }

    async execute({
        fileName,
        fileType,
        fileBuffer,
    }: UploadAndCreateAttachmentUseCaseProps): Promise<UploadAndCreateAttachmentUseCaseResponse> {

        const allowedMimeRegex = /^(image\/(png|jpe?g|webp)|application\/pdf)$/;

        if (!allowedMimeRegex.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType));
        }

        const url = await this.uploader.upload({
            fileName,
            fileType,
            fileBuffer,
        });

        const attachment = Attachment.create({
            title: fileName,
            url,
        });

        await this.attachmentsRepository.create(attachment);

        return right(attachment);
    }
}
