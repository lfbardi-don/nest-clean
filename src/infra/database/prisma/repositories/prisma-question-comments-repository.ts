import { Injectable } from "@nestjs/common";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/questions-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { PaginationParams } from "@/core/repositories/pagination-params";

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionsCommentsRepository {
    create(questionComment: QuestionComment): Promise<QuestionComment> {
        throw new Error("Method not implemented.");
    }

    delete(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<QuestionComment | null> {
        throw new Error("Method not implemented.");
    }

    findManyByQuestionId(questionId: string, page: PaginationParams): Promise<QuestionComment[]> {
        throw new Error("Method not implemented.");
    }
}