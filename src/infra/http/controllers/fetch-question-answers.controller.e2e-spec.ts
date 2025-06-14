import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { AnswerFactory } from "test/factories/make-answer";
import { DatabaseModule } from "@/infra/database/database.module";

describe('Fetch Question Answers (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let answerFactory: AnswerFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[GET] /questions/:id/answers', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        await Promise.all([
            answerFactory.makePrismaAnswer({
                questionId: question.id,
                authorId: user.id,
                content: 'Answer 01',
            }),
            answerFactory.makePrismaAnswer({
                questionId: question.id,
                authorId: user.id,
                content: 'Answer 02',
            }),
        ]);

        const response = await request(app.getHttpServer())
            .get(`/questions/${question.id.toString()}/answers`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            answers: expect.arrayContaining([
                expect.objectContaining({ content: 'Answer 01' }),
                expect.objectContaining({ content: 'Answer 02' }),
            ]),
            totalCount: expect.any(Number),
        });
    });
});