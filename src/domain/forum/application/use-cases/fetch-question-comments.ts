import { Either, right } from "@/core/either";
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface FetchQuestionCommentsUseCaseProps {
    questionId: string;
    page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
    null,
    {
        comments: CommentWithAuthor[];
        totalCount: number;
    }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(private questionsCommentsRepository: QuestionsCommentsRepository) { }

    async execute({
        questionId,
        page,
    }: FetchQuestionCommentsUseCaseProps): Promise<FetchQuestionCommentsUseCaseResponse> {
        const comments = await this.questionsCommentsRepository
            .findManyByQuestionIdWithAuthor(questionId, { page, limit: 20 });

        return right({ comments, totalCount: comments.length });
    }
}
