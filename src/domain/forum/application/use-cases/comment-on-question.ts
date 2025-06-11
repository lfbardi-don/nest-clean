import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";


interface CommentOnQuestionUseCaseProps {
    authorId: string;
    questionId: string;
    content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
    ResourceNotFoundError,
    { questionComment: QuestionComment }
>;

export class CommentOnQuestionUseCase {
    constructor(
        private questionsCommentsRepository: QuestionsCommentsRepository,
        private questionsRepository: QuestionsRepository
    ) { }

    async execute({
        authorId,
        questionId,
        content,
    }: CommentOnQuestionUseCaseProps): Promise<CommentOnQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
            content,
        });

        await this.questionsCommentsRepository.create(questionComment);

        return right({ questionComment });
    }
}
