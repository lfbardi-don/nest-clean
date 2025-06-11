import { AnswerCommentProps, AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
    return AnswerComment.create({
        authorId: new UniqueEntityId(),
        answerId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}