import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class QuestionsRepository {
    abstract create(question: Question): Promise<Question>
    abstract findBySlug(slug: string): Promise<Question | null>
    abstract findById(id: string): Promise<Question | null>
    abstract findManyRecent(params: PaginationParams): Promise<Question[]>
    abstract delete(question: Question): Promise<void>
    abstract save(question: Question): Promise<void>
}
