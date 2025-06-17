import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionsCommentsRepository implements QuestionsCommentsRepository {

    public questionsComments: QuestionComment[] = [];

    constructor(
        private studentsRepository: InMemoryStudentsRepository,
    ) { }

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

    async findManyByQuestionIdWithAuthor(
        questionId: string,
        page: PaginationParams
    ): Promise<CommentWithAuthor[]> {
        const questionsComments = this.questionsComments
            .filter((questionComment) => questionComment.questionId.toString() === questionId)
            .slice((page.page - 1) * 20, page.page * 20)
            .map((questionComment) => {
                const author = this.studentsRepository.students.find(
                    (student) => student.id.equals(questionComment.authorId)
                );

                if (!author) {
                    throw new Error('Author with id ' + questionComment.authorId + ' not found');
                }

                return CommentWithAuthor.create({
                    commentId: questionComment.id,
                    content: questionComment.content,
                    authorId: questionComment.authorId,
                    createdAt: questionComment.createdAt,
                    updatedAt: questionComment.updatedAt,
                    author: author.name,
                });
            });

        return questionsComments;
    }
}