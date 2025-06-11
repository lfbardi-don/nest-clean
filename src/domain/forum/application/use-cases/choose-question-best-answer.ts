import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { AnswersRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { UnauthorizedError } from "../../../../core/errors/errors/unauthorized-error";

interface ChooseQuestionBestAnswerUseCaseProps {
    authorId: string;
    answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
    ResourceNotFoundError | UnauthorizedError,
    { question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private questionsRepository: QuestionsRepository,
    ) { }

    async execute({
        authorId,
        answerId,
    }: ChooseQuestionBestAnswerUseCaseProps): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);
        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        const question = await this.questionsRepository.findById(answer.questionId.toValue());
        if (!question) {
            return left(new ResourceNotFoundError());
        }


        if (question.authorId.toString() !== authorId) {
            return left(new UnauthorizedError());
        }

        question.bestAnswerId = answer.id;

        await this.questionsRepository.save(question);

        return right({ question });
    }
}
