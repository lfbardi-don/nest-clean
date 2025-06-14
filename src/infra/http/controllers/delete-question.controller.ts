import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
    constructor(private deleteQuestion: DeleteQuestionUseCase) { }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @CurrentUser() user: JWTPayload,
        @Param('id') questionId: string
    ) {
        const userId = user.sub;

        const result = await this.deleteQuestion.execute({
            questionId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}