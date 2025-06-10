import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { JwtService } from "@nestjs/jwt";

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/accounts")
export class AuthenticateController {
    constructor(
        private jwt: JwtService,
    ) { }

    @Post("/authenticate")
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body

        const token = await this.jwt.sign({ sub: 'user-id' })

        return token
    }
}