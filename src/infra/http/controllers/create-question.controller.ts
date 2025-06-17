import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTPayload } from "@/infra/auth/jwt.strategy";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.string().uuid()),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
export class CreateQuestionController {
    constructor(private createQuestion: CreateQuestionUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: JWTPayload
    ) {
        const { title, content, attachments } = body;
        const userId = user.sub;

        const result = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: attachments,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}