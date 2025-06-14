import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";

interface FetchQuestionAnswersUseCaseProps {
    questionId: string;
    page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
    null,
    {
        answers: Answer[];
        totalCount: number;
    }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
    constructor(private answersRepository: AnswersRepository) { }

    async execute({
        questionId,
        page,
    }: FetchQuestionAnswersUseCaseProps): Promise<FetchQuestionAnswersUseCaseResponse> {
        const answers = await this.answersRepository.findManyByQuestionId(questionId, { page, limit: 20 });
        return right({ answers, totalCount: answers.length });
    }
}
