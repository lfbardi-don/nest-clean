import { AnswersRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerUseCaseProps {
    answerId: string;
    authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    null
>;

@Injectable()
export class DeleteAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) { }

    async execute({
        answerId,
        authorId,
    }: DeleteAnswerUseCaseProps): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);
        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        if (answer.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }
        await this.answersRepository.delete(answer);
        return right(null);
    }
}
