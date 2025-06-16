import { BadRequestException, Controller, FileTypeValidator, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import { InvalidAttachmentTypeError } from "@/domain/forum/application/use-cases/errors/invalid-attachment-type";

@Controller('/attachments')
export class UploadAttachmentController {
    constructor(private uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async handle(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
                new FileTypeValidator({ fileType: '.(png|jpg|jpeg|webp|pdf)' })
            ]
        })
    ) file: Express.Multer.File) {
        const result = await this.uploadAndCreateAttachmentUseCase.execute({
            fileName: file.originalname,
            fileType: file.mimetype,
            fileBuffer: file.buffer
        });

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case InvalidAttachmentTypeError:
                    throw new BadRequestException(error.message);
                default:
                    throw new BadRequestException(error.message);
            }
        }

        const attachmentId = result.value.id.toString();

        return { attachmentId };
    }
}