import { QuestionProps, Question } from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
    return Question.create({
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}

@Injectable()
export class QuestionFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
        const question = makeQuestion(data);

        await this.prisma.question.create({
            data: PrismaQuestionMapper.toPrisma(question),
        });

        return question;
    }
}