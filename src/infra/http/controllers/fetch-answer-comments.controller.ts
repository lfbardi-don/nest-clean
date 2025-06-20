import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Query, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/answers/:id/comments")
export class FetchAnswerCommentsController {
    constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('id') answerId: string
    ) {
        const result = await this.fetchAnswerComments.execute({
            page,
            answerId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const { comments, totalCount } = result.value;

        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP), totalCount };
    }
}