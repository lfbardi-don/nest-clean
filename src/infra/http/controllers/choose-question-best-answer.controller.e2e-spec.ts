import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { AnswerFactory } from 'test/factories/make-answer'
import { HttpStatus } from '@nestjs/common'

describe('Choose question best answer (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let answerFactory: AnswerFactory
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[PATCH] /answers/:id/choose-best', async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const answerId = answer.id.toString();

        await request(app.getHttpServer())
            .patch(`/answers/${answerId}/choose-best`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
            .expect(HttpStatus.NO_CONTENT);

        const questionOnDatabase = await prisma.question.findUnique({
            where: {
                id: question.id.toString(),
                bestAnswerId: answer.id.toString(),
            },
        });

        expect(questionOnDatabase).toBeDefined();
    })
})