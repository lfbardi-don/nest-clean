import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository";

interface FetchQuestionCommentsUseCaseProps {
    questionId: string;
    page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
    null,
    {
        questionComments: QuestionComment[];
        totalCount: number;
    }
>

export class FetchQuestionCommentsUseCase {
    constructor(private questionsCommentsRepository: QuestionsCommentsRepository) { }

    async execute({
        questionId,
        page,
    }: FetchQuestionCommentsUseCaseProps): Promise<FetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionsCommentsRepository.findManyByQuestionId(questionId, { page, limit: 20 });
        return right({ questionComments, totalCount: questionComments.length });
    }
}
