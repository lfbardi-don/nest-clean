import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { AnswerFactory } from "test/factories/make-answer";

describe('Delete Answer Comment (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
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

        prisma = moduleRef.get(PrismaService);
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

    test('[DELETE] /answers/comments/:id', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const answerComment = await answerCommentFactory.makePrismaAnswerComment({
            answerId: answer.id,
            authorId: user.id,
        });

        const answerCommentId = answerComment.id.toString();

        await request(app.getHttpServer())
            .delete(`/answers/comments/${answerCommentId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.NO_CONTENT);

        const answerCommentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: answerCommentId,
            },
        });

        expect(answerCommentOnDatabase).toBeNull();
    });
});