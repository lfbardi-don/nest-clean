import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionsCommentsRepository implements QuestionsCommentsRepository {
    public questionsComments: QuestionComment[] = [];

    async create(questionComment: QuestionComment): Promise<QuestionComment> {
        this.questionsComments.push(questionComment);
        return questionComment;
    }

    async delete(questionComment: QuestionComment): Promise<void> {
        const questionCommentIndex = this.questionsComments.findIndex((q) => q.id === questionComment.id);
        this.questionsComments.splice(questionCommentIndex, 1);
    }

    async findById(id: string): Promise<QuestionComment | null> {
        return this.questionsComments.find((questionComment) => questionComment.id.toString() === id) || null;
    }

    async findManyByQuestionId(questionId: string, page: PaginationParams): Promise<QuestionComment[]> {
        const questionsComments = this.questionsComments.filter((questionComment) => questionComment.questionId.toString() === questionId);
        return questionsComments.slice((page.page - 1) * 20, page.page * 20);
    }
}