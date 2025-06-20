import { Question as PrismaQuestion, Prisma } from "@prisma/client";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create({
            title: raw.title,
            content: raw.content,
            authorId: new UniqueEntityId(raw.authorId),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
            slug: Slug.create(raw.slug),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityId(raw.id));
    }

    static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            title: question.title,
            content: question.content,
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            slug: question.slug.value,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
}   