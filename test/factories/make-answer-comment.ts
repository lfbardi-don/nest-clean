import { AnswerCommentProps, AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
    return AnswerComment.create({
        authorId: new UniqueEntityId(),
        answerId: new UniqueEntityId(),
        content: faker.lorem.paragraph(),
        ...override,
    }, id);
}

@Injectable()
export class AnswerCommentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
        const answerComment = makeAnswerComment(data);

        await this.prisma.comment.create({
            data: PrismaAnswerCommentMapper.toPrisma(answerComment),
        });

        return answerComment;
    }
}