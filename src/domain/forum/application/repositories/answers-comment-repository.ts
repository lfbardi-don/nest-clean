import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class AnswersCommentsRepository {
    abstract create(answerComment: AnswerComment): Promise<AnswerComment>
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract delete(answerComment: AnswerComment): Promise<void>
    abstract findManyByAnswerId(answerId: string, page: PaginationParams): Promise<AnswerComment[]>
    abstract findManyByAnswerIdWithAuthor(answerId: string, page: PaginationParams): Promise<CommentWithAuthor[]>
}
