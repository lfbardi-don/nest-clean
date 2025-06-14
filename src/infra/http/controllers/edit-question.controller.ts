import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller("/questions/:id")
export class EditQuestionController {
    constructor(private editQuestion: EditQuestionUseCase) { }

    @Put()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
        @CurrentUser() user: JWTPayload,
        @Param('id') questionId: string
    ) {
        const { title, content } = body;
        const userId = user.sub;

        const result = await this.editQuestion.execute({
            questionId,
            authorId: userId,
            title,
            content,
            attachmentsIds: [],
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}