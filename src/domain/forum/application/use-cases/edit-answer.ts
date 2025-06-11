import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";
import { AnswersAttachmentsRepository } from "../repositories/answers-attachments-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditAnswerUseCaseProps {
    answerId: string;
    authorId: string;
    content: string;
    attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    {
        answer: Answer;
    }
>;

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswersAttachmentsRepository
    ) { }

    async execute({
        answerId,
        authorId,
        content,
        attachmentsIds,
    }: EditAnswerUseCaseProps): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);
        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        if (answer.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }

        const existingAnswerAttachments = await this.answerAttachmentsRepository
            .findManyByAnswerId(answerId);

        const answerAttachments = new AnswerAttachmentList(existingAnswerAttachments);

        const newAnswerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id,
            });
        });

        answerAttachments.update(newAnswerAttachments);

        answer.content = content;
        answer.attachments = answerAttachments;

        await this.answersRepository.save(answer);
        return right({ answer });
    }
}
