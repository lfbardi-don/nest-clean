import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { QuestionPresenter } from "../presenters/question-presenter";

const queryValidationPipe = new ZodValidationPipe(z.string());

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
    constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async handle(@Param('slug', queryValidationPipe) slug: string) {
        const result = await this.getQuestionBySlug.execute({
            slug,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const { question } = result.value;

        return { question: QuestionPresenter.toHTTP(question) };
    }
}