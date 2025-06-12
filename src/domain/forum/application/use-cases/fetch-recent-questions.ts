import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface FetchRecentQuestionsUseCaseProps {
    page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
    null,
    {
        questions: Question[];
        totalCount: number;
    }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        page,
    }: FetchRecentQuestionsUseCaseProps): Promise<FetchRecentQuestionsUseCaseResponse> {
        const questions = await this.questionsRepository.findManyRecent({ page, limit: 20 });

        return right({ questions, totalCount: questions.length });
    }
}
