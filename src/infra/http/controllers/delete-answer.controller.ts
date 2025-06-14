import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";

@Controller("/answers/:id")
export class DeleteAnswerController {
    constructor(private deleteAnswer: DeleteAnswerUseCase) { }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @CurrentUser() user: JWTPayload,
        @Param('id') answerId: string
    ) {
        const userId = user.sub;

        const result = await this.deleteAnswer.execute({
            answerId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}