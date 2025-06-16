import { Uploader, UploadParams } from "@/domain/forum/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {
    private client: S3Client;

    constructor(private envService: EnvService) {
        const accountId = this.envService.get<string>('CLOUDFLARE_ACCOUNT_ID');
        const accessKeyId = this.envService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.envService.get<string>('AWS_SECRET_ACCESS_KEY');

        this.client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async upload({ fileName, fileType, fileBuffer }: UploadParams): Promise<string> {
        const uploadId = randomUUID();
        const uniqueFileName = `${uploadId}-${fileName}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.envService.get<string>('AWS_BUCKET_NAME'),
                Key: uniqueFileName,
                Body: fileBuffer,
                ContentType: fileType,
            })
        );

        return uniqueFileName;
    }
}