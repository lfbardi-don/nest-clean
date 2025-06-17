import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";

describe('Get Question By Slug (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let questionAttachmentFactory: QuestionAttachmentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

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

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            slug: Slug.create('question-title-1'),
            title: 'Question Title 1',
        });

        const attachment = await attachmentFactory.makePrismaAttachment();

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        });

        const response = await request(app.getHttpServer())
            .get(`/questions/question-title-1`)
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.OK);

        expect(response.body).toEqual({
            question: expect.objectContaining({
                title: 'Question Title 1',
                slug: 'question-title-1',
                authorId: user.id.toString(),
                author: user.name,
                attachments: expect.arrayContaining([
                    expect.objectContaining({
                        id: attachment.id.toString(),
                        url: attachment.url,
                        title: attachment.title,
                    }),
                ]),
            })
        });
    });
});