import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";

@Module({
    providers: [
        PrismaService,
        PrismaQuestionsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentRepository,
        PrismaAnswersRepository,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
    ],
    exports: [
        PrismaService,
        PrismaQuestionsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentRepository,
        PrismaAnswersRepository,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
    ],
})
export class DatabaseModule { } 