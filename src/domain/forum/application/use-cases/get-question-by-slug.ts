import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface GetQuestionBySlugUseCaseProps {
    slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        question: QuestionDetails;
    }
>

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        slug,
    }: GetQuestionBySlugUseCaseProps): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findDetailsBySlug(slug);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        return right({ question });
    }
}
