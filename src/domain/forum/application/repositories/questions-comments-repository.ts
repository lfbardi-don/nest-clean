import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export interface QuestionsCommentsRepository {
    create(questionComment: QuestionComment): Promise<QuestionComment>
    delete(questionComment: QuestionComment): Promise<void>
    findById(id: string): Promise<QuestionComment | null>
    findManyByQuestionId(questionId: string, page: PaginationParams): Promise<QuestionComment[]>
}
