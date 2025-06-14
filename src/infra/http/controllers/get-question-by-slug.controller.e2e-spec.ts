import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe('Get Question By Slug (E2E)', () => {
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

    test('[GET] /questions/:slug', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456',
            },
        });

        const access_token = jwt.sign({ sub: user.id });

        await prisma.question.create({
            data: {
                title: `Question Title 1`,
                content: 'Question Content',
                slug: `question-title-1`,
                authorId: user.id,
            },
        });

        const response = await request(app.getHttpServer())
            .get('/questions/question-title-1')
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.OK);

        expect(response.body.question).toEqual({
            id: expect.any(String),
            title: 'Question Title 1',
            slug: 'question-title-1',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});