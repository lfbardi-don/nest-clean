import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
    constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) { }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @CurrentUser() user: JWTPayload,
        @Param('id') questionCommentId: string
    ) {
        const userId = user.sub;

        const result = await this.deleteQuestionComment.execute({
            questionCommentId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}