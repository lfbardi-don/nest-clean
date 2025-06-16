import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { Uploader } from '../storage/uploader';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let uploader: Uploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
        uploader = new FakeUploader();

        sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, uploader);
    });

    it('should upload and create attachment', async () => {
        const result = await sut.execute({
            fileName: 'profile.webp',
            fileType: 'image/webp',
            fileBuffer: Buffer.from(''),
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryAttachmentsRepository.attachments).toHaveLength(1);
        expect(result.value).toEqual(inMemoryAttachmentsRepository.attachments[0]);
    });

    it('should not upload an invalid attachment type', async () => {
        const result = await sut.execute({
            fileName: 'profile.mp4',
            fileType: 'video/mp4',
            fileBuffer: Buffer.from(''),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
    });
});
