import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Query, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions/:id/comments")
export class FetchQuestionCommentsController {
    constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('id') questionId: string
    ) {
        const result = await this.fetchQuestionComments.execute({
            page,
            questionId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const { questionComments, totalCount } = result.value;

        return { questionComments: questionComments.map(CommentPresenter.toHTTP), totalCount };
    }
}