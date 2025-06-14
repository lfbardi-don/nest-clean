import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository";
import { Injectable } from "@nestjs/common";

interface FetchAnswerCommentsUseCaseProps {
    answerId: string;
    page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
    null,
    {
        answerComments: AnswerComment[];
        totalCount: number;
    }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(private answersCommentsRepository: AnswersCommentsRepository) { }

    async execute({
        answerId,
        page,
    }: FetchAnswerCommentsUseCaseProps): Promise<FetchAnswerCommentsUseCaseResponse> {
        const answerComments = await this.answersCommentsRepository.findManyByAnswerId(answerId, { page, limit: 20 });
        return right({ answerComments, totalCount: answerComments.length });
    }
}
