import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswersCommentsRepository {
    constructor(private prisma: PrismaService) { }


    async create(answerComment: AnswerComment): Promise<AnswerComment> {
        const raw = PrismaAnswerCommentMapper.toPrisma(answerComment);

        const createdComment = await this.prisma.comment.create({
            data: raw,
        });

        return PrismaAnswerCommentMapper.toDomain(createdComment);
    }

    async findById(id: string): Promise<AnswerComment | null> {
        const comment = await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });

        if (!comment) {
            return null;
        }

        return PrismaAnswerCommentMapper.toDomain(comment);
    }

    async delete(answerComment: AnswerComment): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: answerComment.id.toString(),
            },
        });
    }

    async findManyByAnswerId(answerId: string, page: PaginationParams): Promise<AnswerComment[]> {
        const comments = await this.prisma.comment.findMany({
            where: {
                answerId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: page.limit,
            skip: (page.page - 1) * page.limit,
        });

        return comments.map(PrismaAnswerCommentMapper.toDomain);
    }

    async findManyByAnswerIdWithAuthor(answerId: string, page: PaginationParams): Promise<CommentWithAuthor[]> {
        const comments = await this.prisma.comment.findMany({
            where: {
                answerId,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: page.limit,
            skip: (page.page - 1) * page.limit,
        });

        return comments.map(PrismaCommentWithAuthorMapper.toDomain);
    }
}