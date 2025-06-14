import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { AnswerFactory } from "test/factories/make-answer";
import { DatabaseModule } from "@/infra/database/database.module";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";

describe('Fetch Answer Comments (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let answerFactory: AnswerFactory;
    let answerCommentFactory: AnswerCommentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        answerCommentFactory = moduleRef.get(AnswerCommentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[GET] /answers/:id/comments', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        await Promise.all([
            answerCommentFactory.makePrismaAnswerComment({
                answerId: answer.id,
                authorId: user.id,
                content: 'Comment 01',
            }),
            answerCommentFactory.makePrismaAnswerComment({
                answerId: answer.id,
                authorId: user.id,
                content: 'Comment 02',
            }),
        ]);

        const response = await request(app.getHttpServer())
            .get(`/answers/${answer.id.toString()}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            answerComments: expect.arrayContaining([
                expect.objectContaining({ content: 'Comment 01' }),
                expect.objectContaining({ content: 'Comment 02' }),
            ]),
            totalCount: expect.any(Number),
        });
    });
});