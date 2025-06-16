import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';
import { AnswerFactory } from 'test/factories/make-answer';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment';
import { HttpStatus } from '@nestjs/common';

describe('Edit answer (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let answerFactory: AnswerFactory;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let answerAttachmentFactory: AnswerAttachmentFactory;
    let jwt: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                AttachmentFactory,
                AnswerAttachmentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[PUT] /answers/:id', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const attachment = await attachmentFactory.makePrismaAttachment();
        const attachment2 = await attachmentFactory.makePrismaAttachment();

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            attachmentId: attachment.id,
            answerId: answer.id,
        });

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            attachmentId: attachment2.id,
            answerId: answer.id,
        });

        const attachment3 = await attachmentFactory.makePrismaAttachment();

        const answerId = answer.id.toString();

        await request(app.getHttpServer())
            .put(`/answers/${answerId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: 'New answer',
                attachments: [attachment.id.toString(), attachment3.id.toString()],
            })
            .expect(HttpStatus.NO_CONTENT);

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {
                content: 'New answer',
            },
        });

        expect(answerOnDatabase).toBeDefined();

        const answerAttachmentsOnDatabase = await prisma.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id,
            },
        });

        expect(answerAttachmentsOnDatabase).toHaveLength(2);
        expect(answerAttachmentsOnDatabase).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: attachment.id.toString(),
                }),
                expect.objectContaining({
                    id: attachment3.id.toString(),
                }),
            ])
        );
    });
});