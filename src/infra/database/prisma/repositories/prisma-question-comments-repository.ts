import { Injectable } from "@nestjs/common";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questions-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionsCommentsRepository {
    constructor(private prisma: PrismaService) { }


    async create(questionComment: QuestionComment): Promise<QuestionComment> {
        const raw = PrismaQuestionCommentMapper.toPrisma(questionComment);

        const createdComment = await this.prisma.comment.create({
            data: raw,
        });

        return PrismaQuestionCommentMapper.toDomain(createdComment);
    }

    async delete(questionComment: QuestionComment): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: questionComment.id.toString(),
            },
        });
    }

    async findById(id: string): Promise<QuestionComment | null> {
        const comment = await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });

        if (!comment) {
            return null;
        }

        return PrismaQuestionCommentMapper.toDomain(comment);
    }

    async findManyByQuestionId(questionId: string, page: PaginationParams): Promise<QuestionComment[]> {
        const comments = await this.prisma.comment.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: page.limit,
            skip: (page.page - 1) * page.limit,
        });

        return comments.map(PrismaQuestionCommentMapper.toDomain);
    }

    async findManyByQuestionIdWithAuthor(questionId: string, page: PaginationParams): Promise<CommentWithAuthor[]> {
        const comments = await this.prisma.comment.findMany({
            where: {
                questionId,
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