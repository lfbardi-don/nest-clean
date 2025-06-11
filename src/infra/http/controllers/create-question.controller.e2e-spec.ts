import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe('Create Question (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456',
            },
        });

        const access_token = jwt.sign({ sub: user.id });

        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
                title: 'Question Title',
                content: 'Question Content',
            })
            .expect(HttpStatus.CREATED);

        const questionId = response.body.question.id;
        console.log('Question ID:', questionId);

        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
            },
        });

        expect(question).toBeDefined();
    });
});