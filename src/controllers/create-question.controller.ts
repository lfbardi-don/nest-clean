import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { CurrentUser } from "@/auth/current-user-decorator";
import { JWTPayload } from "@/auth/jwt.strategy";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private prisma: PrismaService) { }

    @Post()
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: JWTPayload
    ) {
        const { title, content } = body;

        const question = await this.prisma.question.create({
            data: {
                title,
                content,
                slug: this.generateSlug(title),
                author: {
                    connect: {
                        id: user.sub,
                    }
                }
            }
        });

        return question;
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
            .trim() // Remove leading and trailing spaces
            .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
    }
}