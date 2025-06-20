import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface CreateQuestionUseCaseProps {
    authorId: string;
    title: string;
    content: string;
    attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<null, Question>;

@Injectable()
export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) { }

    async execute({
        authorId,
        title,
        content,
        attachmentsIds,
    }: CreateQuestionUseCaseProps): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({
            authorId: new UniqueEntityId(authorId),
            title,
            content,
        });

        question.attachments = new QuestionAttachmentList(
            attachmentsIds.map((attachmentId) => {
                return QuestionAttachment.create({
                    attachmentId: new UniqueEntityId(attachmentId),
                    questionId: question.id,
                });
            }),
        );

        await this.questionsRepository.create(question);

        return right(question);
    }
}
