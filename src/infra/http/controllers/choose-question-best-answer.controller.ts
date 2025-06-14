import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

@Controller("/answers/:id/choose-best")
export class ChooseQuestionBestAnswerController {
    constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) { }

    @Patch()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @CurrentUser() user: JWTPayload,
        @Param('id') answerId: string
    ) {
        const userId = user.sub;

        const result = await this.chooseQuestionBestAnswer.execute({
            answerId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}