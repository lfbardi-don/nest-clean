import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DatabaseModule } from "@/infra/database/database.module";

describe('Fetch Recent Questions (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[GET] /questions', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        await Promise.all([
            questionFactory.makePrismaQuestion({
                authorId: user.id,
                title: 'Question 01',
            }),
            questionFactory.makePrismaQuestion({
                authorId: user.id,
                title: 'Question 02',
            }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
            questions: expect.arrayContaining([
                expect.objectContaining({ title: 'Question 01' }),
                expect.objectContaining({ title: 'Question 02' }),
            ]),
            totalCount: expect.any(Number),
        });
    });
});