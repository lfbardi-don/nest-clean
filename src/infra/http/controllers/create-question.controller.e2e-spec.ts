import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { AttachmentFactory } from "test/factories/make-attachment";

describe('Create Question (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;
    let attachmentFactory: AttachmentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, AttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /questions', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const attachments = await Promise.all([
            attachmentFactory.makePrismaAttachment(),
            attachmentFactory.makePrismaAttachment(),
            attachmentFactory.makePrismaAttachment(),
        ]);

        await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                title: 'Question Title',
                content: 'Question Content',
                attachments: attachments.map((attachment) => attachment.id.toString()),
            })
            .expect(HttpStatus.CREATED);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Question Title',
            },
        });

        expect(questionOnDatabase).toBeDefined();

        const attachmentsOnDatabase = await prisma.attachment.findMany({
            where: {
                questionId: questionOnDatabase?.id,
            },
        });

        expect(attachmentsOnDatabase).toHaveLength(3);
    });
});