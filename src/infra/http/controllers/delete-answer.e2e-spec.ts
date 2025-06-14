import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { AnswerFactory } from "test/factories/make-answer";

describe('Delete Answer (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let answerFactory: AnswerFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[DELETE] /answers/:id', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        await request(app.getHttpServer())
            .delete(`/answers/${answer.id.toString()}`)
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.NO_CONTENT);

        const answerOnDatabase = await prisma.answer.findUnique({
            where: {
                id: answer.id.toString(),
            },
        });

        expect(answerOnDatabase).toBeNull();
    });
});