import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { compare } from "bcryptjs";

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
export class AuthenticateController {
    constructor(private jwt: JwtService, private prisma: PrismaService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body;

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await compare(password, user.password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwt.sign({ sub: user.id });

        return { access_token: token };
    }
}