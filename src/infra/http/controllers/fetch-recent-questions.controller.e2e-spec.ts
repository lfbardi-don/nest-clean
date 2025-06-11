import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe('Fetch Recent Questions (E2E)', () => {
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

    test('[GET] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456',
            },
        });

        const access_token = jwt.sign({ sub: user.id });

        await prisma.question.createMany({
            data: Array.from({ length: 22 }, (_, index) => ({
                title: `Question Title ${index + 1}`,
                content: 'Question Content',
                slug: `question-title-${index + 1}`,
                authorId: user.id,
            })),
        });

        const response = await request(app.getHttpServer())
            .get('/questions')
            .query({ page: 2 })
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.OK);

        expect(response.body.questions.length).toBe(2);
    });
});