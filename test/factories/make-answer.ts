import { AnswerProps, Answer } from "@/domain/forum/enterprise/entities/answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
    return Answer.create({
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}

@Injectable()
export class AnswerFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
        const answer = makeAnswer(data);

        await this.prisma.answer.create({
            data: PrismaAnswerMapper.toPrisma(answer),
        });

        return answer;
    }
}