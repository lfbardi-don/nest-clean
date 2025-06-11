import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";

interface DeleteQuestionCommentUseCaseProps {
    authorId: string;
    questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    null
>;

export class DeleteQuestionCommentUseCase {
    constructor(
        private questionsCommentsRepository: QuestionsCommentsRepository,
    ) { }

    async execute({
        authorId,
        questionCommentId,
    }: DeleteQuestionCommentUseCaseProps): Promise<DeleteQuestionCommentUseCaseResponse> {
        const questionComment = await this.questionsCommentsRepository.findById(questionCommentId);

        if (!questionComment) {
            return left(new ResourceNotFoundError());
        }

        if (questionComment.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }

        await this.questionsCommentsRepository.delete(questionComment);
        return right(null);
    }
}
