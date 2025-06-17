import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionsAttachmentsRepository } from "@/domain/forum/application/repositories/questions-attachments-repository";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    constructor(
        private readonly prisma: PrismaService,
        private questionsAttachmentsRepository: QuestionsAttachmentsRepository,
    ) { }

    async create(question: Question): Promise<Question> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await this.prisma.question.create({
            data,
        });

        await this.questionsAttachmentsRepository.createMany(question.attachments.getItems());

        return question;
    }

    async findBySlug(slug: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug,
            },
        });

        if (!question) {
            return null;
        }

        return PrismaQuestionMapper.toDomain(question);
    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug,
            },
            include: {
                attachments: true,
                author: true,
            }
        });

        if (!question) {
            return null;
        }

        return PrismaQuestionDetailsMapper.toDomain(question);
    }

    async findById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                id,
            },
        });

        if (!question) {
            return null;
        }

        return PrismaQuestionMapper.toDomain(question);
    }

    async findManyRecent({ page, limit }: PaginationParams): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return questions.map(PrismaQuestionMapper.toDomain);
    }

    async delete(question: Question): Promise<void> {
        await this.prisma.question.delete({
            where: {
                id: question.id.toString(),
            },
        });
    }

    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await Promise.all([
            this.prisma.question.update({
                where: {
                    id: question.id.toString(),
                },
                data,
            }),
            this.questionsAttachmentsRepository.createMany(question.attachments.getNewItems()),
            this.questionsAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
        ]);
    }
}