import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
    constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) { }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @CurrentUser() user: JWTPayload,
        @Param('id') answerCommentId: string
    ) {
        const userId = user.sub;

        const result = await this.deleteAnswerComment.execute({
            answerCommentId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}