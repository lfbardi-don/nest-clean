import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";

describe('Delete Question Comment (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let questionCommentFactory: QuestionCommentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        questionCommentFactory = moduleRef.get(QuestionCommentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[DELETE] /questions/comments/:id', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const questionComment = await questionCommentFactory.makePrismaQuestionComment({
            questionId: question.id,
            authorId: user.id,
        });

        const questionCommentId = questionComment.id.toString();

        await request(app.getHttpServer())
            .delete(`/questions/comments/${questionCommentId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.NO_CONTENT);

        const questionCommentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: questionCommentId,
            },
        });

        expect(questionCommentOnDatabase).toBeNull();
    });
});