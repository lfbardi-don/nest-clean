import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionsAttachmentsRepository } from './in-memory-questions-attachments-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {

    constructor(
        private questionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository,
        private attachmentsRepository: InMemoryAttachmentsRepository,
        private studentsRepository: InMemoryStudentsRepository,
    ) { }

    public questions: Question[] = [];

    async findById(id: string): Promise<Question | null> {
        return this.questions.find((q) => q.id.toString() == id) || null;
    }

    async findBySlug(slug: string): Promise<Question | null> {
        return this.questions.find((q) => q.slug.value === slug) || null;
    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
        const question = this.questions.find((q) => q.slug.value === slug);

        if (!question) {
            return null;
        }

        const author = this.studentsRepository.students
            .find((student) => student.id.equals(question.authorId));

        if (!author) {
            throw new Error('Author with id ' + question.authorId.toString() + ' not found');
        }

        const questionAttachments = this.questionAttachmentsRepository.questionAttachments
            .filter((attachment) => attachment.questionId.equals(question.id));

        const attachments = questionAttachments.map(
            (questionAttachment) => {
                const attachment = this.attachmentsRepository.attachments
                    .find((attachment) => attachment.id.equals(questionAttachment.attachmentId));

                if (!attachment) {
                    throw new Error('Attachment with id ' + questionAttachment.attachmentId.toString() + ' not found');
                }

                return attachment;
            }
        );

        return QuestionDetails.create({
            questionId: question.id,
            authorId: question.authorId,
            author: author.name,
            title: question.title,
            slug: question.slug,
            content: question.content,
            attachments: attachments,
            bestAnswerId: question.bestAnswerId,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        });
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