import { Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("/accounts")
export class CreateAccountController {
    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any) {
        const { name, email, password } = body

        const userAlreadyExists = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (userAlreadyExists) {
            throw new ConflictException("User already exists")
        }

        const user = await this.prisma.user.create({
            data: { name, email, password }
        })

        return user
    }
}