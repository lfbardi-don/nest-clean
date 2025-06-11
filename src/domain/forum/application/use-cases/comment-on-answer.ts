import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface CommentOnAnswerUseCaseProps {
    authorId: string;
    answerId: string;
    content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
    ResourceNotFoundError,
    { answerComment: AnswerComment }
>;

export class CommentOnAnswerUseCase {
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository,
        private answersRepository: AnswersRepository
    ) { }

    async execute({
        authorId,
        answerId,
        content,
    }: CommentOnAnswerUseCaseProps): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityId(authorId),
            answerId: new UniqueEntityId(answerId),
            content,
        });
        await this.answerCommentsRepository.create(answerComment);
        return right({ answerComment });
    }
}
