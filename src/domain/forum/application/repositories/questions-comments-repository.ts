import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionsCommentsRepository {
    abstract create(questionComment: QuestionComment): Promise<QuestionComment>
    abstract delete(questionComment: QuestionComment): Promise<void>
    abstract findById(id: string): Promise<QuestionComment | null>
    abstract findManyByQuestionId(questionId: string, page: PaginationParams): Promise<QuestionComment[]>
    abstract findManyByQuestionIdWithAuthor(questionId: string, page: PaginationParams): Promise<CommentWithAuthor[]>
}
