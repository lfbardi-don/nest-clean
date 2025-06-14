import { QuestionCommentProps, QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
    return QuestionComment.create({
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}

@Injectable()
export class QuestionCommentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaQuestionComment(data: Partial<QuestionCommentProps> = {}): Promise<QuestionComment> {
        const questionComment = makeQuestionComment(data);

        await this.prisma.comment.create({
            data: PrismaQuestionCommentMapper.toPrisma(questionComment),
        });

        return questionComment;
    }
}