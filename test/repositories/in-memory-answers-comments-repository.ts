import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comment-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryAnswersCommentsRepository implements AnswersCommentsRepository {

    constructor(private studentsRepository: InMemoryStudentsRepository) { }

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

    async findManyByAnswerIdWithAuthor(answerId: string, page: PaginationParams): Promise<CommentWithAuthor[]> {
        const answersComments = this.answersComments
            .filter((answerComment) => answerComment.answerId.toString() === answerId)
            .slice((page.page - 1) * 20, page.page * 20)
            .map((answerComment) => {
                const author = this.studentsRepository.students
                    .find((student) => student.id.equals(answerComment.authorId));

                if (!author) {
                    throw new Error('Author with id ' + answerComment.authorId + ' not found');
                }

                return CommentWithAuthor.create({
                    commentId: answerComment.id,
                    authorId: answerComment.authorId,
                    content: answerComment.content,
                    createdAt: answerComment.createdAt,
                    updatedAt: answerComment.updatedAt,
                    author: author.name,
                });
            });

        return answersComments;
    }
}