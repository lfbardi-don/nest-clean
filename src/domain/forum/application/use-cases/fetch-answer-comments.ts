import { Either, right } from "@/core/either";
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

interface FetchAnswerCommentsUseCaseProps {
    answerId: string;
    page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
    null,
    {
        comments: CommentWithAuthor[];
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
        const comments = await this.answersCommentsRepository
            .findManyByAnswerIdWithAuthor(answerId, { page, limit: 20 });

        return right({ comments, totalCount: comments.length });
    }
}
