import { Either, left, right } from "@/core/either";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionUseCaseProps {
    questionId: string;
    authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    null
>;

@Injectable()
export class DeleteQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        questionId,
        authorId,
    }: DeleteQuestionUseCaseProps): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);
        if (!question) {
            return left(new ResourceNotFoundError());
        }

        if (question.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }
        await this.questionsRepository.delete(question);
        return right(null);
    }
}
