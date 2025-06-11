import { AnswerProps, Answer } from "@/domain/forum/enterprise/entities/answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
    return Answer.create({
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}