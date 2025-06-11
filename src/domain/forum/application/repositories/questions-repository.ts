import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';

export interface QuestionsRepository {
    create(question: Question): Promise<Question>
    findBySlug(slug: string): Promise<Question | null>
    findById(id: string): Promise<Question | null>
    findManyRecent(params: PaginationParams): Promise<Question[]>
    delete(question: Question): Promise<void>
    save(question: Question): Promise<void>
}
