import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentRepository } from "./prisma/repositories/prisma-student-repository";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questions-comments-repository";
import { QuestionsAttachmentsRepository } from "@/domain/forum/application/repositories/questions-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswersAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comment-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository,
        },
        {
            provide: StudentsRepository,
            useClass: PrismaStudentRepository,
        },
        {
            provide: QuestionsAttachmentsRepository,
            useClass: PrismaQuestionAttachmentsRepository,
        },
        {
            provide: QuestionsCommentsRepository,
            useClass: PrismaQuestionCommentRepository,
        },
        {
            provide: AnswersRepository,
            useClass: PrismaAnswersRepository,
        },
        {
            provide: AnswersAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository,
        },
        {
            provide: AnswersCommentsRepository,
            useClass: PrismaAnswerCommentsRepository,
        },
        {
            provide: AttachmentsRepository,
            useClass: PrismaAttachmentsRepository,
        }
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        StudentsRepository,
        QuestionsAttachmentsRepository,
        QuestionsCommentsRepository,
        AnswersRepository,
        AnswersAttachmentsRepository,
        AnswersCommentsRepository,
        AttachmentsRepository,
    ],
})
export class DatabaseModule { } 