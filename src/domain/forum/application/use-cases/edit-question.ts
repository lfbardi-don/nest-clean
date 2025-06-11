import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";
import { QuestionsAttachmentsRepository } from "../repositories/questions-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseProps {
    questionId: string;
    authorId: string;
    title: string;
    content: string;
    attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    {
        question: Question;
    }
>;

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionsAttachmentsRepository,
    ) { }

    async execute({
        questionId,
        authorId,
        title,
        content,
        attachmentsIds,
    }: EditQuestionUseCaseProps): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);
        if (!question) {
            return left(new ResourceNotFoundError());
        }

        if (question.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }

        const existingQuestionAttachments = await this.questionAttachmentsRepository
            .findManyByQuestionId(questionId);

        const questionAttachments = new QuestionAttachmentList(existingQuestionAttachments);

        const newQuestionAttachments = attachmentsIds.map((attachmentId) => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                questionId: question.id,
            });
        });

        questionAttachments.update(newQuestionAttachments);

        question.title = title;
        question.content = content;
        question.attachments = questionAttachments;

        await this.questionsRepository.save(question);
        return right({ question });
    }
}
