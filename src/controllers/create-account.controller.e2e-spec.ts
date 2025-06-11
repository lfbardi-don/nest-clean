import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe('Create Account (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /accounts', async () => {
        await request(app.getHttpServer())
            .post('/accounts')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456',
            })
            .expect(HttpStatus.CREATED);

        const newUser = await prisma.user.findUnique({
            where: {
                email: 'john.doe@example.com',
            }
        });

        expect(newUser).toBeDefined();
    });
});