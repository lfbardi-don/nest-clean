import { Comment as PrismaComment, Prisma } from "@prisma/client";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment): QuestionComment {
        if (!raw.questionId) {
            throw new Error("Invalid question comment");
        }

        return QuestionComment.create({
            content: raw.content,
            authorId: new UniqueEntityId(raw.authorId),
            questionId: new UniqueEntityId(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityId(raw.id));
    }

    static toPrisma(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
            questionId: questionComment.questionId.toString(),
            content: questionComment.content,
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
        };
    }
}   