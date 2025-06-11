import { AnswersCommentsRepository } from "../repositories/answers-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';

interface DeleteAnswerCommentUseCaseProps {
    authorId: string;
    answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    null
>;

export class DeleteAnswerCommentUseCase {
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository,
    ) { }

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentUseCaseProps): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

        if (!answerComment) {
            return left(new ResourceNotFoundError());
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }

        await this.answerCommentsRepository.delete(answerComment);
        return right(null);
    }
}
