import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionsAttachmentsRepository } from "@/domain/forum/application/repositories/questions-attachments-repository";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    constructor(
        private readonly prisma: PrismaService,
        private questionsAttachmentsRepository: QuestionsAttachmentsRepository,
        private cache: CacheRepository,
    ) { }

    async create(question: Question): Promise<Question> {
        const data = PrismaQuestionMapper.toPrisma(question);

        await this.prisma.question.create({
            data,
        });

        await this.questionsAttachmentsRepository.createMany(question.attachments.getItems());

        DomainEvents.dispatchEventsForAggregate(question.id);

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
        const cacheHit = await this.cache.get(`question:${slug}:details`);

        if (cacheHit) {
            return JSON.parse(cacheHit);
        }

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

        await this.cache.set(`question:${slug}:details`, JSON.stringify(question));

        const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

        return questionDetails;
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
                    id: data.id,
                },
                data,
            }),
            this.questionsAttachmentsRepository.createMany(question.attachments.getNewItems()),
            this.questionsAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
            this.cache.delete(`question:${data.slug}:details`),
        ]);

        DomainEvents.dispatchEventsForAggregate(question.id);
    }
}