import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryQuestionsRepository implements QuestionsRepository {

    constructor(
        public questionAttachmentsRepository: QuestionsAttachmentsRepository,
    ) { }

    public questions: Question[] = [];

    async findById(id: string): Promise<Question | null> {
        return this.questions.find((q) => q.id.toString() == id) || null;
    }

    async findBySlug(slug: string): Promise<Question | null> {
        return this.questions.find((q) => q.slug.value === slug) || null;
    }

    async delete(question: Question): Promise<void> {
        const questionIndex = this.questions.findIndex((q) => q.id == question.id);
        this.questions.splice(questionIndex, 1);

        this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
    }

    async create(question: Question): Promise<Question> {
        this.questions.push(question);

        await this.questionAttachmentsRepository.createMany(question.attachments.getItems());

        DomainEvents.dispatchEventsForAggregate(question.id);
        return question;
    }

    async save(question: Question): Promise<void> {
        const questionIndex = this.questions.findIndex((q) => q.id == question.id);
        this.questions[questionIndex] = question;

        await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems());

        await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems());

        DomainEvents.dispatchEventsForAggregate(question.id);
    }

    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        return this.questions
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);
    }
}