import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswersAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
    constructor(
        private prisma: PrismaService,
        private answerAttachmentsRepository: AnswersAttachmentsRepository,
    ) { }

    async create(answer: Answer): Promise<Answer> {
        const raw = PrismaAnswerMapper.toPrisma(answer);

        const createdAnswer = await this.prisma.answer.create({
            data: raw,
        });

        await this.answerAttachmentsRepository.createMany(answer.attachments.getItems());

        return PrismaAnswerMapper.toDomain(createdAnswer);
    }

    async findById(id: string): Promise<Answer | null> {
        const answer = await this.prisma.answer.findUnique({
            where: {
                id,
            },
        });

        if (!answer) {
            return null;
        }

        return PrismaAnswerMapper.toDomain(answer);
    }

    async delete(answer: Answer): Promise<void> {
        await this.prisma.answer.delete({
            where: {
                id: answer.id.toString(),
            },
        });
    }

    async save(answer: Answer): Promise<void> {
        const raw = PrismaAnswerMapper.toPrisma(answer);

        await Promise.all([
            this.prisma.answer.update({
                where: {
                    id: answer.id.toString(),
                },
                data: raw,
            }),
            this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems()),
            this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
        ]);
    }

    async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
        const answers = await this.prisma.answer.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: params.limit,
            skip: (params.page - 1) * params.limit,
        });

        return answers.map(PrismaAnswerMapper.toDomain);
    }
}   