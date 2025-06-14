import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";

describe('Edit Question (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);

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

        await request(app.getHttpServer())
            .put(`/questions/${question.id.toString()}`)
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                title: 'Question Title Updated',
                content: 'Question Content Updated',
            })
            .expect(HttpStatus.NO_CONTENT);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Question Title Updated',
                content: 'Question Content Updated',
            },
        });

        expect(questionOnDatabase).toBeDefined();
    });
});