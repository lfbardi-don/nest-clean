import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersAttachmentsRepository } from '@/domain/forum/application/repositories/answers-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements AnswersRepository {
    constructor(
        private answerAttachmentsRepository: AnswersAttachmentsRepository,
    ) { }

    public answers: Answer[] = [];

    async create(answer: Answer): Promise<Answer> {
        this.answers.push(answer);

        await this.answerAttachmentsRepository.createMany(answer.attachments.getItems());

        DomainEvents.dispatchEventsForAggregate(answer.id);

        return answer;
    }

    async findById(id: string): Promise<Answer | null> {
        return this.answers.find((a) => a.id.toString() == id) || null;
    }

    async delete(answer: Answer): Promise<void> {
        const answerIndex = this.answers.findIndex((a) => a.id == answer.id);
        this.answers.splice(answerIndex, 1);

        await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    }

    async save(answer: Answer): Promise<void> {
        const answerIndex = this.answers.findIndex((a) => a.id == answer.id);
        this.answers[answerIndex] = answer;

        await this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems());
        await this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems());

        DomainEvents.dispatchEventsForAggregate(answer.id);
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        return this.answers
            .filter((a) => a.questionId.toString() == questionId)
            .slice((page - 1) * 20, page * 20);
    }
}