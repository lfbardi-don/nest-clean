import { Question as PrismaQuestion, User as PrismaUser, Attachment as PrismaAttachment, Prisma } from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser;
    attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        return QuestionDetails.create({
            authorId: new UniqueEntityId(raw.authorId),
            questionId: new UniqueEntityId(raw.id),
            title: raw.title,
            slug: Slug.create(raw.slug),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
        });
    }
}   