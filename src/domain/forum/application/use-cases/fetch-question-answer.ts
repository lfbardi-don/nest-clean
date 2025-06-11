import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswerUseCaseProps {
    questionId: string;
    page: number;
}

type FetchQuestionAnswerUseCaseResponse = Either<
    null,
    {
        answers: Answer[];
        totalCount: number;
    }
>

export class FetchQuestionAnswerUseCase {
    constructor(private answersRepository: AnswersRepository) { }

    async execute({
        questionId,
        page,
    }: FetchQuestionAnswerUseCaseProps): Promise<FetchQuestionAnswerUseCaseResponse> {
        const answers = await this.answersRepository.findManyByQuestionId(questionId, { page, limit: 20 });
        return right({ answers, totalCount: answers.length });
    }
}
