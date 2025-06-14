import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export abstract class AnswersCommentsRepository {
    abstract create(answerComment: AnswerComment): Promise<AnswerComment>
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract delete(answerComment: AnswerComment): Promise<void>
    abstract findManyByAnswerId(answerId: string, page: PaginationParams): Promise<AnswerComment[]>
}
