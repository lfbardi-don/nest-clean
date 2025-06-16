import { Uploader, UploadParams } from "@/domain/forum/application/storage/uploader";

interface Upload {
    fileName: string;
    url: string;
}

export class FakeUploader implements Uploader {
    public uploads: Upload[] = [];

    async upload(params: UploadParams): Promise<string> {
        this.uploads.push({
            fileName: params.fileName,
            url: 'http://localhost:3000/attachments/1',
        });

        return 'http://localhost:3000/attachments/1';
    }
}