import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()).default([]),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller("/answers/:id")
export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) { }

    @Put()
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBodySchema,
        @CurrentUser() user: JWTPayload,
        @Param('id') answerId: string
    ) {
        const { content, attachments } = body;
        const userId = user.sub;

        const result = await this.editAnswer.execute({
            answerId,
            authorId: userId,
            content,
            attachmentsIds: attachments,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}