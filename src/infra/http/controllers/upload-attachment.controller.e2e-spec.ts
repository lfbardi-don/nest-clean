import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe('Upload Attachment (E2E)', () => {
    let app: INestApplication;
    let jwt: JwtService;
    let studentFactory: StudentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        jwt = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('[POST] /attachments', async () => {
        const user = await studentFactory.makePrismaStudent();

        const access_token = jwt.sign({ sub: user.id.toString() });

        const response = await request(app.getHttpServer())
            .post(`/attachments`)
            .set('Authorization', `Bearer ${access_token}`)
            .attach('file', 'test/e2e/attachment.webp')
            .expect(HttpStatus.OK);

        expect(response.body).toEqual({
            attachmentId: expect.any(String),
        });
    });
});