import { AppModule } from "@/infra/app.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";

describe('Create Question (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let prisma: PrismaService;
    let studentFactory: StudentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /questions', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                title: 'Question Title',
                content: 'Question Content',
            })
            .expect(HttpStatus.CREATED);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Question Title',
            },
        });

        expect(questionOnDatabase).toBeDefined();
    });
});