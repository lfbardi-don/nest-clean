import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";

describe('Edit Question (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let questionAttachmentFactory: QuestionAttachmentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[PUT] /questions/:id', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            title: 'Question Title',
            content: 'Question Content',
        });

        const attachments = await Promise.all([
            attachmentFactory.makePrismaAttachment(),
            attachmentFactory.makePrismaAttachment(),
        ]);

        await Promise.all([
            questionAttachmentFactory.makePrismaQuestionAttachment({
                attachmentId: attachments[0].id,
                questionId: question.id,
            }),
            questionAttachmentFactory.makePrismaQuestionAttachment({
                attachmentId: attachments[1].id,
                questionId: question.id,
            }),
        ]);

        const attachment3 = await attachmentFactory.makePrismaAttachment();

        await request(app.getHttpServer())
            .put(`/questions/${question.id.toString()}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                title: 'Question Title Updated',
                content: 'Question Content Updated',
                attachments: [
                    attachments[0].id.toString(),
                    attachment3.id.toString(),
                ],
            })
            .expect(HttpStatus.NO_CONTENT);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Question Title Updated',
                content: 'Question Content Updated',
            },
        });

        expect(questionOnDatabase).toBeDefined();

        const attachmentsOnDatabase = await prisma.attachment.findMany({
            where: {
                questionId: questionOnDatabase?.id,
            },
        });

        expect(attachmentsOnDatabase).toHaveLength(2);
        expect(attachmentsOnDatabase).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: attachments[0].id.toString(),
                }),
                expect.objectContaining({
                    id: attachment3.id.toString(),
                }),
            ])
        );
    });
});