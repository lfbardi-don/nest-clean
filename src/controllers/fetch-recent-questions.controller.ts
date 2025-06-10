import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { z } from "zod";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
        const questions = await this.prisma.question.findMany({
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                createdAt: 'desc',
            }
        });

        return { questions };
    }
}