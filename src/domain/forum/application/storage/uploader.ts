export interface UploadParams {
    fileName: string;
    fileType: string;
    fileBuffer: Buffer;
}

export abstract class Uploader {
    abstract upload(params: UploadParams): Promise<string>;
}