import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comment-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryAnswersCommentsRepository implements AnswersCommentsRepository {

    public answersComments: AnswerComment[] = [];

    async create(answerComment: AnswerComment): Promise<AnswerComment> {
        this.answersComments.push(answerComment);
        return answerComment;
    }

    async findById(id: string): Promise<AnswerComment | null> {
        return this.answersComments.find((answerComment) => answerComment.id.toString() === id) || null;
    }

    async delete(answerComment: AnswerComment): Promise<void> {
        const answerCommentIndex = this.answersComments.findIndex((a) => a.id.toString() === answerComment.id.toString());
        this.answersComments.splice(answerCommentIndex, 1);
    }

    async findManyByAnswerId(answerId: string, page: PaginationParams): Promise<AnswerComment[]> {
        const answersComments = this.answersComments.filter((answerComment) => answerComment.answerId.toString() === answerId);
        return answersComments.slice((page.page - 1) * 20, page.page * 20);
    }
}