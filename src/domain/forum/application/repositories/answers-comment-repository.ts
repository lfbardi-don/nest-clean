import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswersCommentsRepository {
    create(answerComment: AnswerComment): Promise<AnswerComment>
    findById(id: string): Promise<AnswerComment | null>
    delete(answerComment: AnswerComment): Promise<void>
    findManyByAnswerId(answerId: string, page: PaginationParams): Promise<AnswerComment[]>
}
