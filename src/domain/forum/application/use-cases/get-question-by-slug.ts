import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";


interface GetQuestionBySlugUseCaseProps {
    slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        question: Question;
    }
>

export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        slug,
    }: GetQuestionBySlugUseCaseProps): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findBySlug(slug);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        return right({ question });
    }
}
