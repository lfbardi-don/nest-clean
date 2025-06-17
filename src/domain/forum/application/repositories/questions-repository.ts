import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export abstract class QuestionsRepository {
    abstract create(question: Question): Promise<Question>
    abstract findBySlug(slug: string): Promise<Question | null>
    abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
    abstract findById(id: string): Promise<Question | null>
    abstract findManyRecent(params: PaginationParams): Promise<Question[]>
    abstract delete(question: Question): Promise<void>
    abstract save(question: Question): Promise<void>
}
