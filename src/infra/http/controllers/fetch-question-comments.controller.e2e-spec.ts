import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionCommentFactory } from "test/factories/make-question-comment";

describe('Fetch Question Comments (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let questionCommentFactory: QuestionCommentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        questionCommentFactory = moduleRef.get(QuestionCommentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[GET] /questions/:id/comments', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        await Promise.all([
            questionCommentFactory.makePrismaQuestionComment({
                questionId: question.id,
                authorId: user.id,
                content: 'Comment 01',
            }),
            questionCommentFactory.makePrismaQuestionComment({
                questionId: question.id,
                authorId: user.id,
                content: 'Comment 02',
            }),
        ]);

        const response = await request(app.getHttpServer())
            .get(`/questions/${question.id.toString()}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            questionComments: expect.arrayContaining([
                expect.objectContaining({ content: 'Comment 01' }),
                expect.objectContaining({ content: 'Comment 02' }),
            ]),
            totalCount: expect.any(Number),
        });
    });
});