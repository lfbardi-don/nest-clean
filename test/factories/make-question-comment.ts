import { QuestionCommentProps, QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
    return QuestionComment.create({
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}