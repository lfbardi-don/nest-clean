import { Body, Controller, HttpCode, HttpStatus, BadRequestException, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { InvalidCredentialsError } from "@/domain/forum/application/use-cases/errors/invalid-credentials-error";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
export class AuthenticateController {
    constructor(private authenticateStudent: AuthenticateStudentUseCase) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body;

        const result = await this.authenticateStudent.execute({
            email,
            password,
        });

        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case InvalidCredentialsError:
                    throw new UnauthorizedException(error.message);
                default:
                    throw new BadRequestException(error.message);
            }
        }

        const { accessToken } = result.value;

        return { access_token: accessToken };
    }
}