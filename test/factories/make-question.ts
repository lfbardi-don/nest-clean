import { QuestionProps, Question } from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
    return Question.create({
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}